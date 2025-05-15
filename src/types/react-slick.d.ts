declare module 'react-slick' {
  import { ComponentType } from 'react';

  export interface Settings {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    pauseOnHover?: boolean;
    responsive?: Array<{
      breakpoint: number;
      settings: Settings;
    }>;
    arrows?: boolean;
    className?: string;
    adaptiveHeight?: boolean;
    centerMode?: boolean;
    centerPadding?: string;
    cssEase?: string;
    draggable?: boolean;
    easing?: string;
    fade?: boolean;
    focusOnSelect?: boolean;
    initialSlide?: number;
    lazyLoad?: 'ondemand' | 'progressive';
    rtl?: boolean;
    slide?: string;
    slidesMargin?: number;
    swipe?: boolean;
    swipeToSlide?: boolean;
    touchMove?: boolean;
    touchThreshold?: number;
    variableWidth?: boolean;
    vertical?: boolean;
    verticalSwiping?: boolean;
    waitForAnimate?: boolean;
    children?: React.ReactNode;
  }

  const Slider: ComponentType<Settings>;
  export default Slider;
} 