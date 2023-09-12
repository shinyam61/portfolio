import { debounce } from "debounce"

export default () => {
  const w: {
    root: HTMLElement
    stickeis: HTMLElement[],
    iframes: HTMLIFrameElement[],
    anchorPos: string[][];
    rafIds: number[],
    browser: [number, number]
  } = {
    root: document.getElementById('works') as HTMLElement,
    stickeis: [],
    iframes: [],
    anchorPos: [],
    rafIds: [],
    browser: [window.innerWidth, window.innerHeight]
  }
  const init = () => {
    if (!w.root) {
      return;
    }
    console.log('init works', w.root);

    collectInfo();
    bindScrollAction();
    buildScroller();
    bindResizeAction();
  }

  const collectInfo = () => {
    w.stickeis = Array.from(document.getElementsByClassName('hm-work__sticky')) as HTMLElement[];
  }
  const buildScroller = () => {
    console.log(w.stickeis)
    const options = {
      root: null,
      rootMargin: '0px 0px 0px -10px',
      threshold: 0,
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(entry);
          entry.target.dispatchEvent(new CustomEvent('intoView'));
        } else {
          console.log('----', entry);
          entry.target.dispatchEvent(new CustomEvent('outofView'));
        }
      })
    }, options);

    w.stickeis.forEach(sticky => {
      observer.observe(sticky);
    })
  }
  const bindScrollAction = () => {
    w.stickeis.forEach((stickey, idx) => {
      w.iframes[idx] = stickey.getElementsByClassName('_site')[0] as HTMLIFrameElement;
      w.anchorPos[idx] = stickey.dataset.anchors?.split(',') as string[];
      stickey.addEventListener('intoView', () => {
        scrollAction(idx, stickey);
      })
      stickey.addEventListener('outofView', () => {
        w.rafIds[idx] && cancelAnimationFrame(w.rafIds[idx]);
      })
    })
  }
  const scrollAction = (rafIdPos: number, target: HTMLElement) => {
    const totalScroll = target.clientHeight - w.browser[1];
    const stickyBody = target.getElementsByClassName('hm-work__stickyItem')[0] as HTMLElement;
    const currentScrollPos = stickyBody.offsetTop;

    const firstActionRatio = Math.max(0, Math.min(currentScrollPos / (w.browser[1] * .25), 1));
    const secondActionRatio = Math.max(0, Math.min((currentScrollPos - (w.browser[1] * .25)) / (w.browser[1] * .5), 1));
    const thirdActionRatio = Math.max(0, Math.min((currentScrollPos - (w.browser[1] * .5)) / (w.browser[1] * 1.0), 1));
    const iframeScrollRatio = Math.max(0, Math.min((currentScrollPos - (w.browser[1] * 1.0)) / (totalScroll - (w.browser[1] * 1.0)), 1));
    const height = firstActionRatio;
    const horizontal = 272 - 12 * secondActionRatio;
    const open = Math.floor(104 * thirdActionRatio);
    target.setAttribute('style', `--mock-height:${height};--horizontal:${horizontal}deg;--open:${open}deg;`);

    if (!w.iframes[rafIdPos].dataset.isReloaded && w.iframes[rafIdPos].dataset.isReloaded != 'true' && thirdActionRatio > .5) {
      w.iframes[rafIdPos].src = w.iframes[rafIdPos].dataset.src as string;
      w.iframes[rafIdPos].dataset.isReloaded = 'true';
      w.iframes[rafIdPos].classList.add('_visible');
    }

    if (!!w.iframes[rafIdPos].dataset.isReloaded && w.iframes[rafIdPos].dataset.isReloaded == 'true' && thirdActionRatio > .5) {
      const pointsCount = w.anchorPos[rafIdPos].length + 1
      const srcStr = w.iframes[rafIdPos].dataset.src;
      const throwPos = w.anchorPos[rafIdPos].map((anchor, aIdx) => {
        return iframeScrollRatio > (1 / pointsCount) * (aIdx + 1)
      }).filter(isThrow => isThrow).length - 1;

      if (throwPos > 0 && !w.iframes[rafIdPos].src.includes(w.anchorPos[rafIdPos][throwPos])) {
        w.iframes[rafIdPos].src = `${srcStr}#${w.anchorPos[rafIdPos][throwPos]}`
      }
      console.log(throwPos)
    }

    w.rafIds[rafIdPos] = requestAnimationFrame(() => {
      scrollAction(rafIdPos, target);
    });
  }

  const bindResizeAction = () => {
    window.addEventListener('resize', () => {
      debounce(() => {
        w.browser = [window.innerWidth, window.innerHeight];
      }, 500)();
    })
  }

  init();
}