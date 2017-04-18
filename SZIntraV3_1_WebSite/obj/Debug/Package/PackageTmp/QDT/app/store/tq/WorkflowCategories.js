Ext.define('QDT.store.tq.WorkflowCategories', {
    extend: 'Ext.data.Store',
    fields: [
        'category',
        { name: 'category_string', convert: function (v, record) {
            return Profile.getText('workflowCategory_' + record.data.category);
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