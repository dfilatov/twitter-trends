({
    mustDeps: [
        {
            block: 'i-bem',
            elem: 'dom',
            mods: { init: 'auto' }
        },
        { block: 'bemhtml' }
    ],
    shouldDeps : [
        'i-global'
    ],
    noDeps: [
        {
            block: 'i-bem',
            elem: 'html'
        }
    ]
})
