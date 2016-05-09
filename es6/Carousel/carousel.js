import $ from 'jquery';

/**
 * 定义Carousel轮播类
 *
 * @param {Object} options 配置选项
 * - options.speed {Number} 速度
 * - options.dir {Number} 方向 0: left, 1: right
 * - options.isAutoLoop {Boolean} 是否自动轮播
 * - options.wrapper {String} 容器选择器
 * - options.wrapperInner {String} 容器主体选择器
 * - options.item {String} 容器主体元素选择器
 * - options.indexItem {String} 序列号选择器
 * - options.indexItemEvent {String} 序列号事件
 * - options.indexItemClassName {String} 序列号改变状态的class
 * - options.prevBtn {String} 上一步按钮选择器
 * - options.nextBtn {String} 下一步按钮选择器
 */
const Carousel = function (options) {
    options = $.extend({
        speed: 2000,
        dir: 1,
        timer: null,
        isAutoLoop: true,
        wrapper: '#wrapper',
        wrapperInner: '.wrapper-inner',
        item: '.item',
        indexItem: '.index-item',
        indexItemEvent: 'click',
        indexItemClassName: 'active',
        prevBtn: '.prevBtn',
        nextBtn: '.nextBtn'
    }, options);

    return this.initialize.call(this, options);
};

$.extend(Carousel.prototype, {
    initialize(options) {
        let constructor = this.getConstructor();

        this.wrapper = constructor.find(options.wrapper);
        this.wrapperInner = constructor.find(this.wrapper, options.wrapperInner);
        this.indexItem = constructor.find(this.wrapper, options.indexItem);
        this.prevBtn = constructor.find(this.wrapper, options.prevBtn);
        this.nextBtn = constructor.find(this.wrapper, options.nextBtn);

        // 设置当前轮播索引
        this.currentIndex = 1;

        // 拷贝最后一个元素插入到开始位置
        // 拷贝第一个元素插入到结束位置
        this.cloneItemToHeadAndFooter();

        // 获取轮播的元素的个数
        this.item = constructor.find(this.wrapper, options.item);
        this.itemListLength = this.getItemListLength();

        // 获取每一个元素的宽度
        this.singleItemWidth = this.getSingleItemWidth();

        // 设置容器的宽度
        this.setWrapperInnerWidth();

        // 其他配置信息拷贝到当前实例
        this.copyToContext('speed,dir,timer,isAutoLoop,indexItemEvent,indexItemClassName', options);

        // 初始化为显示第二个元素
        this.setWrapperInnerPosition(this.singleItemWidth);

        // 轮播
        this.autoPlay();

        // 轮播hover事件
        constructor.bindEvent.call(this, this.wrapperInner, 'hover', () => clearInterval(this.timer), () => this.autoPlay());

        // 序号点击或者其他事件
        constructor.bindEvent.call(this, this.indexItem, this.indexItemEvent, (e) => {
            if (!this.wrapperInner.is(':animated')) {
                this.currentIndex = constructor.find(e.currentTarget).index() + 1;
                this.changeIndexItemState();
                this.setWrapperInnerPosition(this.currentIndex * this.singleItemWidth, true);
            }
        });
    },

    copyToContext(props, options) {
        (typeof props === 'string' ? props.split(',') : props).forEach(prop => this[prop] = options[prop]);
    },

    getConstructor() {
        return this.constructor;
    },

    getSingleItemWidth() {
        return this.item.eq(0).width();
    },

    getItemListLength() {
        return this.item.length;
    },

    setWrapperInnerWidth() {
        this.wrapperInner.css('width', this.singleItemWidth * this.itemListLength);
    },

    setWrapperInnerPosition(position, isAnimate = false) {
        this.wrapperInner[isAnimate ? 'animate' : 'css']({ left: -position }, 500);
    },

    cloneItemToHeadAndFooter() {
        let child = this.wrapperInner.children();
        let first = child.first().clone();
        let last = child.last().clone();

        this.wrapperInner.prepend(last).append(first);
    },

    autoPlay() {
        if (this.isAutoLoop) this.timer = setInterval(() => this.move(), this.speed);
    },

    move() {
        let currentIndex = this.currentIndex;

        if (this.dir) this.currentIndex++; // right
        else this.currentIndex--; // left

        if (this.currentIndex > this.itemListLength - 1) {
            // 如果当前索引大于最大索引，将当前索引定位到第三个元素索引
            this.currentIndex = 2;
            this.setWrapperInnerPosition(this.singleItemWidth);
        } else if (this.currentIndex < 0) {
            // 如果当前索引小于最小索引，将当前索引定位到倒数第三个元素索引
            this.currentIndex = this.itemListLength - 3;
            this.setWrapperInnerPosition((this.itemListLength - 2) * this.singleItemWidth);
        }

        this.changeIndexItemState();
        this.setWrapperInnerPosition(this.currentIndex * this.singleItemWidth, true);
    },

    changeIndexItemState() {
        let className = this.indexItemClassName;
        this.indexItem.removeClass(className).eq(this.currentIndex - 1).addClass(className);
    }
});

$.extend(Carousel, {
    find(selector, childSelector) {
        return childSelector ? selector.find(childSelector) : $(selector);
    },

    bindEvent(jqElement, event, ...handles) {
        jqElement[event].apply(jqElement, handles);
    }
});

export { Carousel };