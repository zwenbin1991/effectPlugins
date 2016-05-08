import * as $ from 'jQuery';

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
 * - options.prevBtn {String} 上一步按钮选择器
 * - options.nextBtn {String} 下一步按钮选择器
 */
const Carousel = (options) => {
    options = $.extend({
        speed: 2000,
        dir: 1,
        timer: null,
        isAutoLoop: true,
        wrapper: '#wrapper',
        wrapperInner: '.wrapperInner',
        item: '.item',
        indexItem: '.index-item',
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
        this.singleItemWidth = this.getSingleItemWidth();

        // 设置当前轮播索引
        this.currentIndex = 1;

        // 拷贝最后一个元素插入到开始位置
        // 拷贝第一个元素插入到结束位置
        this.cloneItemToHeadAndFooter();

        // 获取轮播的元素的个数
        this.item = constructor.find(this.wrapper, options.item);
        this.itemListLength = this.getItemListLength();

        // 设置容器的宽度
        this.setWrapperWidth();

        // 其他配置信息拷贝到当前实例
        this.copyToContext('speed,dir,timer,isAutoLoop', options);

        // 轮播
        this.autoPlay();
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

    setWrapperWidth() {
        this.wrapper.css('width', this.singleItemWidth * this.itemListLength);
    },

    setWrapperInnerPosition(position) {
        this.wrapperInner.css('left', -position);
    },

    cloneItemToHeadAndFooter() {
        let first = this.wrapperInner.first().clone();
        let last = this.wrapperInner.last().clone();

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

        this.wrapperInner.animate({ left: -this.currentIndex * this.singleItemWidth }, 500);
    }
});

$.extend(Carousel, {
    find(selector, childSelector) {
        return childSelector ? selector.find(childSelector) : $(selector);
    }
});

export { Carousel };