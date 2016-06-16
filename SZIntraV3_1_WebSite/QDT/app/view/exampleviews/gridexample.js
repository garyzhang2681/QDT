Ext.define('QDT.view.exampleviews.gridexample', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.exampleviews-gridexample',

    stateful: true,
    collapsible: true,
    multiSelect: true,
    stateId: 'stateGrid',
    height: 350,
    title: 'Array Grid',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    columns: [
        { text: 'Name', dataIndex: 'name', sortable: false },
        { text: 'Email', dataIndex: 'email', flex: 1, menuDisabled: true },
        { text: 'Phone', dataIndex: 'phone' }
    ],
    store: Ext.create('Ext.data.Store', {
        storeId: 'simpsonsStore',
        fields: ['name', 'email', 'phone'],
        data: {
            'items': [
                {
                    'name': 'Lisa',
                    "email": "lisa@simpsons.com",
                    "phone": "555-111-1224"
                }, {
                    'name': 'Bart',
                    "email": "bart@simpsons.com",
                    "phone": "555-222-1234"
                }, {
                    'name': 'Homer',
                    "email": "home@simpsons.com",
                    "phone": "555-222-1244"
                }, {
                    'name': 'Marge',
                    "email": "marge@simpsons.com",
                    "phone": "555-222-1254"
                }
            ]
        },
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                root: 'items'
            }
        }
    })

})