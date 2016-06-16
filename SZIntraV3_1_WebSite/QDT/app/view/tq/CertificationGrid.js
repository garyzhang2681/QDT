Ext.define('QDT.view.tq.CertificationGrid', {
    alias: 'widget.tq-certificationgrid',
    extend: 'Ext.grid.Panel',


    initComponent: function () {
        var me = this;





        //        //TODO: local store data filter
        //        me.tbar = [{
        //            text: '显示全部',
        //            enableToggle: true,
        //            toggleHandler: function (btn, pressed) {
        //                me.store.getProxy().extraParams.includeInactive = pressed;
        //                me.store.load({
        //                    params: { includeInactive: pressed, employeeid: me.person }
        //                });
        //            }
        //        }];

        me.callParent();

        //TODO: deactivate skill
        //        me.on({
        //            itemcontextmenu: function (th, rec, item, i, e) {
        //                if (Ext.util.Cookies.get('user') === '307009219' || Ext.util.Cookies.get('user') === '307009509') {
        //                    e.stopEvent();
        //                    var menu = Ext.create('Ext.menu.Menu', {
        //                        items: [{
        //                            text: '取消技能',
        //                            handler: function () {
        //                                Ext.Msg.confirm('', '是否确定取消授权？', function (sel) {
        //                                    if (sel === 'yes') {
        //                                        var id = rec.data.id;
        //                                        KanBan.DeactivateEmpSkill(id, function (res) {
        //                                            if (res.success) {
        //                                                KanBan.util.ghostSuccess();
        //                                                me.store.remove(rec);
        //                                            }
        //                                        });
        //                                    }
        //                                })
        //                            }
        //                        }]
        //                    });
        //                    menu.showAt(e.getXY());
        //                }
        //            }
        //        });
    }

});





