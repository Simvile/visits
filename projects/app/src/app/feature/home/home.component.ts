import { ChangeDetectionStrategy, Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ShellService } from 'lib';
import { ArticleFlowXComponent } from '../articles/article-flow-x.component/article-flow-x.component';

interface MarketplaceItem {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
}

interface FeaturedPost {
  author: string;
  date: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, ArticleFlowXComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly shell = inject(ShellService);

  isScrolled = signal(false);
  menuOpen   = signal(false);

  readonly userName   = computed(() => this.shell.user()?.fullName ?? '');
  readonly isSignedIn = this.shell.isAuthenticated;

  featuredPost: FeaturedPost = {
    author: 'Simvile Zimeme',
    date: 'November 28, 2026',
    title: 'Webflow Wonders: Transforming Your Business Landscape in the Digital Era',
    subtitle: 'CUT | CUT Hotel School Celebrates Top Achievers at the Annual Prestige Awards',
  };

  marketplaceItems: MarketplaceItem[] = [
    { id: 1, name: 'Cookies And Muffins',                   category: 'Food and Snacks',       price: 'From R5.00', image: 'images/market/cookies.png' },
    { id: 2, name: '24 inch Brazilian Weave',               category: 'Wigs & Weaves',         price: 'R2,600.00',  image: 'images/market/weave.png'   },
    { id: 3, name: 'Wide high jeans - light denim blue',    category: 'Fashion & Accessories', price: 'R429',       image: 'images/market/jeans.png'   },
    { id: 4, name: 'FOM Ladies Tekkie - Off-White/ Matcha', category: 'Fashion & Accessories', price: 'R 2,295.00', image: 'images/market/tekkies.png' },
  ];

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
    // Close mobile menu on scroll
    if (this.menuOpen()) this.menuOpen.set(false);
  }
}