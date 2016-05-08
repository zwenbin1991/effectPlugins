require.config({
    baseUrl: '../',
    shim: {
        $: ['jQuery']
    },
    paths: {
        jQuery: 'lib/jQuery',
        Carousel: 'src/Carousel/carousel'
    }
});

require(['Carousel'], function (Carousel) {
    console.log(Carousel);
});
