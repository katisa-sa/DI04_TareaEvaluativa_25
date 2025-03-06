
export interface INoticia {
    status: string;
    totalResults: number;
    articles: IArticulo[];
  }
  
export interface IArticulo {
    source: ISource;
    author: null | string;
    title: string;
    description: null | string;
    url: string;
    urlToImage: null | string;
    publishedAt: string;
    content: null | string;
  }
  
export interface ISource {
    id: null | string;
    name: string;
  }