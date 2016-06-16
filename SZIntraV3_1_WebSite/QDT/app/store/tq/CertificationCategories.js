Ext.define('QDT.store.tq.CertificationCategories', {
    extend: 'Ext.data.Store',
    fields: [
        'category',
        { name: 'category_string', convert: function (v, record) {
            return Profile.getText('certificationCategory_' + record.data.category);
        }
        }
    ],
    data: [{
        category: 'stc'
    }, {
        category: 'llc'
    }, {
        category: 'stamper'
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});