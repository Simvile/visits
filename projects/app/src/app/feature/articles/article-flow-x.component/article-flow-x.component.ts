import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  image: string;
  url?: string;
}

@Component({
  selector: 'app-article-flow-x',
  imports: [],
  templateUrl: './article-flow-x.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFlowXComponent {

  // Spotlight — the top highlighted article
  spotlight = {
    title: 'Budget Speech Breakdown: What You Need to Know About The 2026 Budget and The Economy',
    author: 'Jade Cave',
    url: '#',
  };

  // Featured posts list — replace with real service data
  featuredPosts: Article[] = [
    {
      id: 1,
      title: 'Generational Shift In the Democratic Alliance As Youthful Geordin Hill-Lewis Takes Charge',
      author: 'Andisiwe Fatima',
      date: 'May 28, 2026',
      image: 'images/articles/article1.png',
    },
    {
      id: 2,
      title: 'A group of students raise their hands in the air to signal that they have come in peace.',
      author: 'Simvile Zimeme',
      date: 'June 27, 2026',
      image: 'images/articles/article2.png',
    },
    {
      id: 3,
      title: 'Graduates celebrate as they cross the stage in full academic regalia.',
      author: 'Simvile Zimeme',
      date: 'November 27, 2026',
      image: 'images/articles/article3.png',
    },
  ];
}