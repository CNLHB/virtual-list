export default class VirtualList {
    constructor(options = {}) {
      this.root = document.querySelector(options.el);
      this.listPhantom = this.createListPhantom();
      this.listWrap = this.createListWrap();
      this.root.appendChild(this.listPhantom);
      this.root.appendChild(this.listWrap);
      if (!this.root) {
        throw new Error("el is not element!!!");
      }
      this.listData = options.data;
      this.startIndex = 0;
      this.endIndex = 0;
      this.pageSize = 7;
      this.itemHeight = options.itemHeight || 100;
      this.prev = 5;
      this.next = 5;
      this.scrollTop = 0;
      this.bindScroll();
      this.render(options.render, this.listData);
      this.options = options;
    }

    scrollToLower(len) {
      this.options.scrollToLower();
      for (let index = len; index < len + 3; index++) {
        this.listData.push(index);
      }
    }
    bindScroll() {
      this.root.addEventListener("scroll", () => {
        let scrollTop = this.root.scrollTop;
        let viewport = this.pageSize * this.itemHeight;
        let len = this.listData.length;
        if (scrollTop + this.root.clientHeight == this.root.scrollHeight) {
          this.scrollToLower(len);
          this.scrollTop = scrollTop;
        } else {
        }
        let listHeight = this.listData.length * this.itemHeight;
        let startIndex = Math.floor(scrollTop / this.itemHeight);
        let endIndex = startIndex + this.pageSize;
        let startOffset = scrollTop - (scrollTop % this.itemHeight);
        startIndex = Math.max(startIndex - this.prev, 0);
        endIndex = endIndex + this.next;
        let visibleData = this.listData.slice(startIndex, endIndex);
        this.render(this.options.render, visibleData);
        this.listWrap.style.transform = `translateY(${
          startOffset > this.prev * this.itemHeight
            ? startOffset - this.prev * this.itemHeight
            : 0
        }px)`;
      });
    }
    render(render, data) {
      let flag = document.createDocumentFragment();
      let html = data.reduce((prev, item, index) => {
        let listItem = this.createElementItem(render(item, index));
        // flag.appendChild(listItem);
        return prev + listItem;
      }, "");
      this.listWrap.innerHTML = html;
      this.listPhantom.style.height =
        this.listData.length * this.itemHeight + "px";
    }
    createListWrap() {
      let oDiv = document.createElement("div");
      oDiv.id = "edaWrapper";
      oDiv.classList.add("infinite-list");
      oDiv.style = `
        left: 0;
        right: 0;
        top: 0;
        position: absolute;
        text-align: center;
      `;
      return oDiv;
    }
    createListPhantom() {
      let listPhantom = document.createElement("div");
      listPhantom.classList.add("infinite-list-phantom");
      listPhantom.style = `
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      z-index: -1;
      `;
      return listPhantom;
    }

    createElementItem(html) {
      let flagDOM = document.createElement("div");
      flagDOM.innerHTML = html;
      // return flagDOM.firstElementChild;
      return html;
    }
  }