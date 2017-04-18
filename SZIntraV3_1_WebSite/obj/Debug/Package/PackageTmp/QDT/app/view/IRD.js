Ext.define('QDT.view.IRD', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ird',
    store: 'IrdRouteList',

  //  requires: ['QDT.store.IrdRouteList'],

    columns: [{
        text: Profile.getText('serial_lot'),
        dataIndex: 'serial',
        flex: 1
    }, {
        text: Profile.getText('job'),
        dataIndex: 'job',
        flex: 1
    }, {
        text: Profile.getText('suffix'),
        dataIndex: 'suffix',
        flex: 1
    }, {
        text: Profile.getText('part_num'),
        dataIndex: 'item',
        flex: 1
    }, {
        text: Profile.getText('operator_op'),
        dataIndex: 'operator_op',
        flex: 1
    },{
        text: Profile.getText('ird_revision'),
        dataIndex: 'ird_revision',
        flex: 1
    }, {
        text: Profile.getText('rev_level'),
        dataIndex: 'rev_level',
        flex: 1
    }],



    //    columns: [{
    //        header: 'text2'
    //    }],

    initComponent: function () {
        var me = this;

        //        var x = 2; // depands on the user's role
        //        if (x === 1) {
        //          
        //            this.columns = [{
        //                header: 'text1'
        //            }];
        //            this.gridName = 'irdBomGrid';
        //        } else if (x === 2) {
        //           
        //            this.columns = [{
        //                header: 'text2'
        //            }]
        //            me.gridName = 'irdGrid';
        //        }


        //        this.columns = [{
        //            text: 'serial',
        //            dataIndex: 'serial',
        //            flex: 1
        //        }];




        this.gridName = 'irdRouteListGrid';

        me.tbar = [{
            text: Profile.getText('IRDDetail'),
            xtype: 'button',
             iconCls: 'log',
            scope: me,
            // ownerWidget: 'dr',
            id: 'IRDDetail',
            handler: me.IRDDetail
        }, {
             text: 'SPC', // TODO: Language
            xtype: 'button',
             iconCls: 'statistics-16',
            scope: me,
            // ownerWidget: 'dr',
            name:'spc',
            handler: me.SPC,
            hidden:true
        },
        {
            text: 'IRDBOM',
            xtype: 'button',
            // iconCls: 'add_green',
            scope: me,
            // ownerWidget: 'dr',
            id: 'IRDBOM',
            handler: me.IRDBOM
        },
         '->',
        {
            text: Profile.getText('CreateIRD'),
            xtype: 'button',
            scope: me,
            id: 'createIRD',
            iconCls: 'add_green',
            handler: me.createIRD
        }];

                me.bbar = Ext.widget('pagingtoolbar', {
                    store: me.store,
                    displayInfo: true
                });

        me.callParent();
    },

    IRDDetail: function () {
        var win = Ext.create('QDT.view.IRDDetail');
        win.show();
    },
    IRDBOM: function () {
        var win = Ext.create('QDT.view.IRDBOM');
        win.show();
    },
    createIRD: function () {
        var win = Ext.create('QDT.view.GenerateIRD');
        win.show();
    },

    SPC: function () {

        var spc = Ext.ComponentQuery.query('ird_spc')[0];
        if (spc === undefined) {
            spc = Ext.create('QDT.view.ird.SPC');
        }
        spc.show();
    }

});
