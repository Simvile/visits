import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  computed,
  signal,
  effect,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

/** Simple in-memory cache — shared across all component instances */
const iconCache = new Map<string, string>();

/**
 * Strips hardcoded width/height attributes from the root <svg> element
 * so that CSS can fully control sizing via the viewBox.
 * Also ensures width/height are set to 100% so the SVG fills its container.
 */
function normalizeSvg(raw: string): string {
  return raw.replace(/<svg([^>]*)>/, (_match, attrs: string) => {
    const cleaned = attrs
      .replace(/\s*width\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\s*height\s*=\s*["'][^"']*["']/gi, '');
    return `<svg${cleaned} width="100%" height="100%">`;
  });
}

@Component({
  selector: 'app-icons',
  standalone: true,
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsComponent {
  // ── Inputs (Angular 19 signal-based) ──────────────────────────────────────

  /** SVG filename without extension — must match a file in shared/icons/ */
  readonly name = input.required<string>();

  /** Predefined size token */
  readonly size = input<IconSize>('md');

  /** Explicit width in px — overrides size */
  readonly width = input<number | undefined>(undefined);

  /** Explicit height in px — overrides size */
  readonly height = input<number | undefined>(undefined);

  /** CSS color; defaults to currentColor so it inherits from the parent */
  readonly color = input<string>('currentColor');

  /** Accessible label; omit to hide the icon from screen readers */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Path to the icons folder — points to shared/icons by default */
  readonly basePath = input<string>('icons');

  // ── Computed values ────────────────────────────────────────────────────────

  readonly resolvedWidth = computed(() => this.width() ?? SIZE_MAP[this.size()]);
  readonly resolvedHeight = computed(() => this.height() ?? SIZE_MAP[this.size()]);
  readonly iconUrl = computed(() => `${this.basePath()}/${this.name()}.svg`);

  // ── Internal state (writable signals) ─────────────────────────────────────

  readonly svgContent = signal<SafeHtml | null>(null);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  // ── Services ───────────────────────────────────────────────────────────────

  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ── Effect: re-fetch whenever name or basePath changes ────────────────────

  constructor() {
    effect(() => {
      const url = this.iconUrl();

      // Skip fetching entirely on the server — relative URLs fail in SSR
      if (!this.isBrowser) {
        return;
      }

      // Serve from cache instantly — no HTTP call needed
      if (iconCache.has(url)) {
        this.svgContent.set(
          this.sanitizer.bypassSecurityTrustHtml(iconCache.get(url)!)
        );
        this.hasError.set(false);
        this.isLoading.set(false);
        return;
      }

      this.isLoading.set(true);
      this.hasError.set(false);
      this.svgContent.set(null);

      this.http
        .get(url, { responseType: 'text' })
        .pipe(
          catchError(() => {
            this.hasError.set(true);
            this.isLoading.set(false);
            return of(null);
          })
        )
        .subscribe((svg) => {
          if (svg) {
            const normalized = normalizeSvg(svg);
            iconCache.set(url, normalized);
            this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(normalized));
          }
          this.isLoading.set(false);
        });
    });
  }
}