Ext.define('Asz.ux.MultipleTextFields', {
    extend: 'Ext.container.Container',
    alias: 'widget.multipletextfields',

    //e.g. for discreancy, nameBase='discrepancy', name=nameBase+fieldCount=discrepancy1
    nameBase: '',

    fieldCount: 0,

    fieldMargin: '5 0 5 0',
    fieldWidth: 160,
    labelWidth: 50,
    fieldType: 'textarea',
    fieldHeight: 50,

    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'button',
            text: Profile.getText("add"),
            width: '60px',
            handler: function () {
                me.addField();
            }
        }];

        me.callParent();
    },

    getNewInstance: function () {
        var me = this;
        var field = Ext.create('Ext.container.Container', {
            layout: {
                type: 'hbox'
            },
          //  margin: me.fieldMargin,
            items: [{
                xtype: me.fieldType,
              //  width: me.fieldWidth,
                //  height: me.fieldHeight,
              flex:5,
                labelWidth: me.labelWidth,
                allowBlank: false,
                fieldLabel: Profile.getText('NormalValue'),
                name: me.nameBase + 'Normal' + (me.fieldCount).toString()
            }, {
                xtype: me.fieldType,
             //   width: me.fieldWidth,
                //   height: me.fieldHeight,
                flex: 5,
                allowBlank: false,
                labelWidth: me.labelWidth,
                fieldLabel: Profile.getText('DiscrepancyValue'),
                name: me.nameBase + 'Discrepancy' + (me.fieldCount).toString()
            }, {
                xtype: 'button',
              //  height: 20,
                flex: 1,
                tooltip: Profile.getText("remove"),
                iconCls: 'delete',
               // margin: '0 0 0 5',
                handler: function () {
                    me.removeField(field);
                }
            }]
        });
        return field;
    },

    addField: function () {
        this.fieldCount++;
        this.insert(this.fieldCount, this.getNewInstance());
    },

    removeField: function (field) {
        field.down('textarea').submitValue = false;

        this.remove(field, true);
    }
});