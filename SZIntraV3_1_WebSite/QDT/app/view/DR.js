Ext.define('QDT.view.DR', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.dr',
    //not necessary if is required in app.js but a good way to indicate what ux are required here
    //  requires: ['Asz.ux.Button'],
    store: 'RelatedDRs',
    //store: 'SearchDRs',
    columns: [{
        dataIndex: 'dr.dr_num', text: Profile.getText('dr_num'), width: 82
    }, {
        dataIndex: 'dr.discrepancy_item', text: Profile.getText('part_num'), width: 80
    }, {
        dataIndex: 'serial_lot', text: Profile.getText('serial_lot'), width: 80
    }, {
        dataIndex: 'drType.qdtComString.' + Profile.getLang() + '_string', text: Profile.getText('dr_type'), width: 80
    }, {
        dataIndex: 'dr.status', text: Profile.getText('status'), width: 100
    }, {
        dataIndex: 'dr.create_date', text: Profile.getText('create_date'), width: 100, renderer: dateRenderer
    },
    //    {
    //        dataIndex: 'createBy.user.sso', text: Profile.getText('create_by_sso'), flex: 1
    //    }, 
    {
    dataIndex: 'createBy.user.name_' + Profile.getLang(), text: Profile.getText('create_by'), width: 65
}, {
    dataIndex: 'dr.due_date', text: Profile.getText('due_date'), width: 100, renderer: dueDateRenderer
},
//    {
//        dataIndex: 'qeOwner.employee.sso', text: Profile.getText('qe_sso'), flex: 1, renderer: emphasizeSSO
//    }, {
//        dataIndex: 'meOwner.employee.sso', text: Profile.getText('me_sso'), flex: 1, renderer: emphasizeSSO
//    }, 
    {
    dataIndex: 'qeOwner.employee.name_' + Profile.getLang(), text: Profile.getText('qe_owner'), width: 65, renderer: this.emphasizeName
}, {
    dataIndex: 'meOwner.employee.name_' + Profile.getLang(), text: Profile.getText('me_owner'), width: 65, renderer: this.emphasizeName
}, {
    dataIndex: 'dr.description', text: Profile.getText('description'), flex: 1
}, {

    dataIndex: 'dr.quantity', text: Profile.getText('quantity'), width: 40
}],

initComponent: function () {
    var me = this;


    me.on("itemcontextmenu", function itemcontextmenu(his, record, item, index, e) {
        // itemcontextmenu( Ext.view.View this, Ext.data.Model record,  
        // HTMLElement item, Number index, Ext.EventObject e, Object eOpts )  
        // 分类代码表的右键菜单   
        e.preventDefault();
        e.stopEvent(); // 取消浏览器默认事件     
        var array = [{
            text: Profile.getText('Edit'),
            handler: function () {

                var is_dr_creator = (record.data['dr.create_by'] === Profile.getUser()['user_id']);

                QDT.IsEmptyDr(record.data['dr.dr_num'], function (result) {
                    if (result.success && result.isEmptyDr) {
                        if (is_dr_creator && record.data['dr.status']) {
                            var dr = Ext.widget('createdr', {
                                isUpdate: true,
                                drNum: record.data['dr.dr_num']
                            });

                            dr.down('form').loadRecord(record);

                            var discrepancyItemSearchCombo = dr.down('form').down('[name=discrepancy_item]');
                            var item = Ext.create('QDT.model.Item', {
                                item: record.data['discrepancy_item']
                            });
                            discrepancyItemSearchCombo.setValue(item);


                            var qeSearchCombo = dr.down('form').down('[name=dr_qe_owner]');
                            var qe = Ext.create('QDT.model.Employee', {
                                name: record.data['qeOwner.employee.name_' + Profile.getLang()],
                                sso: record.data['qeOwner.employee.sso'],
                                employee_id: record.data['dr_qe_owner']
                            });
                            qeSearchCombo.setValue(qe);


                            var meSearchCombo = dr.down('form').down('[name=dr_me_owner]');
                            var me = Ext.create('QDT.model.Employee', {
                                name: record.data['meOwner.employee.name_' + Profile.getLang()],
                                sso: record.data['meOwner.employee.sso'],
                                employee_id: record.data['dr_me_owner']
                            });
                            meSearchCombo.setValue(me);

                            var drTypeCombo = dr.down('form').down('[name=dr_type]');
                            var dr_type = Ext.create('QDT.model.CommonString',
                            {
                                id: record.data['dr.dr_type'],
                                common_string: record.data['drType.qdtComString.' + Profile.getLang() + '_string']
                            });
                            drTypeCombo.setValue(dr_type);

                            var drSourceCombo = dr.down('form').down('[name=source]');
                            var dr_source = Ext.create('QDT.model.CommonString',
                            {
                                id: record.data['dr.source'],
                                common_string: record.data['source.qdtComString.' + Profile.getLang() + '_string']
                            });
                            drSourceCombo.setValue(dr_source);

                            var discrepancyGrid = dr.down('form').down('#discrepancy_grid');
                            discrepancyGrid.store.load({
                                params: {
                                    dr_num: record.data['dr.dr_num']
                                }
                            });

                            dr.down('form').down('[name=serialOrLot]').setValue(record.data['serialOrLot']);

                            dr.show();
                        } else {
                            My.Msg.warning(Profile.getText('ActionWithoutPermission'));
                        }
                    } else {
                        My.Msg.warning(Profile.getText('ActionWithoutPermission'));
                    }
                });
            }
        }, {
            text: Profile.getText('Delete'),
            handler: function () {

                QDT.DeleteDr(record.data['dr_num'], function (result) {
                    QDT.util.Util.generalCallbackCRUD(result, 'd');
                    me.store.load();
                });
            }
        }];
        var nodemenu = new Ext.menu.Menu({
            items: array
        });
        nodemenu.showAt(e.getXY()); // 菜单打开的位置    
    });





    me.tbar = [{
        text: Profile.getText('Create'),
        xtype: 'button',
        iconCls: 'add_green',
        scope: me,
        // ownerWidget: 'dr',
        id: 'createDR',
        handler: me.onCreateDRClick
    }, {
        xtype: 'button',
        text: Profile.getText('Filter'),
        iconCls: 'search',
        scope: me,
        handler: me.onFilterDRClick
    }];

    me.bbar = Ext.widget('pagingtoolbar', {
        store: me.store,
        displayInfo: true
    });
    me.callParent();
},

//launch new DR window
onCreateDRClick: function () {
    var win = Ext.create('QDT.view.CreateDR');
    win.show();
},


//launch search DR window
onFilterDRClick: function () {
    //Call search dr window.
    var searchDr = Ext.ComponentQuery.query('searchdr')[0];
    if (searchDr === undefined) {
        searchDr = Ext.create('QDT.view.SearchDR');
    }
    searchDr.show();
},

emphasizeSSO: function (sso) {
    if (sso === Profile.getUserSso()) {
        return '<span style="color:blue;">' + sso + '</span>';
    }
    else {
        return sso;
    }
},


emphasizeName: function (username) {
    if (username === Profile.getUserName()) {
        return '<span style="color:blue;">' + username + '</span>';
    }
    else {
        return username;
    }
}


});





