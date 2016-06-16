//抽取对于status filter的两个控件的控制，因为我的认证中的MyCertificationGrid和员工技能当中的已认证都依赖于status filter
Ext.define('QDT.controller.tq.CertificationBase', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.CertificationBaseGrid'
    ],

    init: function () {
        var me = this;

        me.control({
            'tq-certificationbasegrid checkbox[name=filter_status]': {
                change: function (field, newValue, oldValue) {
                    field.up('grid').down('[name=status]').setDisabled(!newValue);
                    field.up('grid').store.load();
                }
            },

            'tq-certificationbasegrid combo[name=status]': {
                blur: function (cmp) {
                    var grid = cmp.up('grid');
                    grid.store.load();
                }
            }
        });
    }
});