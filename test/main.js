require.config({
    baseUrl: '../',
    paths: {
        jquery: 'lib/jquery',
        carousel: 'src/Carousel/carousel'
    }
});

// 无缝轮播
require(['carousel'], function (carousel) {
    new carousel.Carousel({
        speed: 2000,
        dir: 1,
        isAutoLoop: true,
        wrapper: '#wjj',
        wrapperInner: '.wjj-inner',
        indexItem: '.index-item',
        prevBtn: '.prev-btn',
        nextBtn: '.next-btn'
    });
});


