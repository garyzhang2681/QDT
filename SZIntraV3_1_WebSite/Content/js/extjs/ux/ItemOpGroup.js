Ext.define('Asz.ux.ItemOpGroup', {
    extend: 'Ext.container.Container',
    alias: 'widget.itemopgroup',
    prefix: '', //eg:  source_
    suffix: '', //eg: _2
    layout: 'hbox',
    labelWidth: 50,
    operWidth: 60,
    disabled: false,
    defaults: {
        margin: '5 5 5 0'
    },
    hidden: false,
    frame:true,
    initComponent: function () {
        var me = this;
      
        me.items = [{
            xtype: 'itemcombo',
            name: me.prefix + 'part_num' + me.suffix,
            itemId: me.prefix + 'part_num' + me.suffix,
            labelWidth: me.labelWidth,
            width: 120,
            disabled: me.disabled,
            hidden:me.hidden,
            forceSelection: true,
            listeners: {
                select: function (combo, records) {
                    me.down('#' + me.prefix + 'oper_num' + me.suffix).reset();
                    me.down('#' + me.prefix + 'oper_num' + me.suffix).hide();
                    me.down('#' + me.prefix + 'oper_num' + me.suffix).show();
                },

                change: function (cmp, newVal) {
                    if (newVal === null) {
                        cmp.reset();
                        me.down('#' + me.prefix + 'oper_num' + me.suffix).reset();
                        me.down('#' + me.prefix + 'oper_num' + me.suffix).hide();
                    }
                }
            }
        }, {
            xtype: 'combobox',
            name: me.prefix + 'oper_num' + me.suffix,
            itemId: me.prefix + 'oper_num' + me.suffix,
            labelWidth: Profile.getLang() == 'en' ? 110 : 60,
            fieldLabel: Profile.getText('operation_num'),
            displayField: 'oper_num',
            valueField: 'oper_num',
            editable: false,
            disabled: me.disabled,
            hidden: me.hidden,
            hidden: true,
            width: Profile.getLang() == 'en' ? 170 : 120,
            listeners: {
                beforeshow: function () {
                    DpUtil.GetOpsByItem(me.down('#' + me.prefix + 'part_num' + me.suffix).value, function (result) {
                        if (result.success === true && result.data != null) {
                            me.down('#' + me.prefix + 'oper_num' + me.suffix).setDisabled(me.disabled);
                            var ops = result.data;
                            var op_store = Ext.create('Ext.data.Store', {
                                fields: [
                                    { name: 'oper_num', mapping: 'oper_num' }
                                ],
                                data: ops
                            });
                            me.down('#' + me.prefix + 'oper_num' + me.suffix).bindStore(op_store);

                        } else {
                            me.down('#' + me.prefix + 'oper_num' + me.suffix).reset();
                            me.down('#' + me.prefix + 'oper_num' + me.suffix).setDisabled(true);
                        }
                    });
                }

            }
        }];

        me.callParent();
    }
});