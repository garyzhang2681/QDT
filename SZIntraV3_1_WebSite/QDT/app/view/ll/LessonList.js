Ext.define('QDT.view.ll.LessonList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ll-lessonlist',
    requires: [
        'QDT.util.Renderer'
    ],
    activeRecord: {},
    frame: true,
    columns: [
        {
            dataIndex: 'category_id',
            text: Profile.getText('category'),
            width: 100,
            renderer: QDT.util.Renderer.lessonCategory
        }, {
            dataIndex: 'subject',
            text: Profile.getText('subject'),
            flex: 1,
            minWidth: 200
            //,
            //renderer: QDT.util.Renderer.ellipsis(20, false)
        }, {
            dataIndex: 'owner_id',
            text: Profile.getText('owner'),
            width: 80,
            renderer: QDT.util.Renderer.employeeName
        }, {
            dataIndex: 'business',
            text: Profile.getText('business'),
            width: 80,
            renderer: Ext.util.Format.capitalize
        }, {
            dataIndex: 'create_by',
            text: Profile.getText('create_by'),
            width: 80,
            renderer: QDT.util.Renderer.username
        }, {
            dataIndex: 'create_date',
            text: Profile.getText('create_date'),
            width: 80,
            renderer: QDT.util.Renderer.dateTimeRenderer
        }
    ],


    initComponent: function () {
        var me = this;

        var lesson_store = Ext.create('QDT.store.ll.Lessons', {
            autoDestroy: true,
            listeners: {
                datachanged: function () {
                    me.getSelectionModel().deselectAll();
                }
            }
        });
        Ext.applyIf(me, {
            store: lesson_store,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                margin: '0 0 5 0',
                // border: true,
                hidden: me.hide(),
                items: [
            {
                iconCls: 'add',
                itemId: 'add'
            }, {
                iconCls: 'edit',
                itemId: 'edit',
                disabled: true
            }, {
                iconCls: 'delete',
                itemId: 'delete',
                disabled: true
            }, {
                iconCls: 'create',
                itemId: 'create',
                disabled: true

            }]
            }, {
                xtype: 'toolbar',
                dock: 'top',
                layout: 'fit',
                items: [{
                    xtype: 'form',
                    layout: 'vbox',
                    name: 'search_lesson',
                    itemId: 'search_lesson',
                    frame: true,
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        margin: '0 0 5 0',
                        defaults: {
                            margin: '2 10 0 0'
                        },
                        items: [{
                            xtype: 'll-workinggroupcombo',
                            name: 'working_group',
                            editable: false,
                            width: 180
                        }, {
                            xtype: 'itemcombo',
                            name: 'part_num',
                            itemId: 'part_num',
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 120
                        }, {
                            xtype: 'businesscombo',
                            name: 'business',
                            labelWidth: Profile.getLang() == 'en' ? 30 : 60,
                            width: 140
                        }, {
                            xtype: 'll-categorycombo',
                            name: 'category_id',
                            itemId: 'category_id',
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 140
                        }]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            margin: '0 10 2 0'
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'subject',
                            itemId: 'subject',
                            fieldLabel: Profile.getText('subject'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 30,
                            width: 150
                        }, {
                            xtype: 'employeecombo',
                            name: 'owner_id',
                            itemId: 'owner_id',
                            fieldLabel: Profile.getText('owner'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 60
                        }, {
                            xtype: 'nativeusercombo',
                            name: 'create_by_id',
                            itemId: 'create_by_id',
                            fieldLabel: Profile.getText('create_by'),
                            labelWidth: Profile.getLang() == 'en' ? 30 : 40,
                            width: 60
                        }, {
                            xtype: 'button',
                            iconCls: 'undo',
                            itemId: 'clear',
                            name: 'clear',
                            text: Profile.getText('clear')
                        }, {
                            xtype: 'button',
                            iconCls: 'search',
                            itemId: 'search',
                            name: 'search',
                            text: Profile.getText('Search')
                        }]
                    }]
                }]
            }, {
                xtype: 'pagingtoolbar',
                store: lesson_store,
                itemId: 'lesson_pages',
                name: 'lesson_pages',
                dock: 'bottom',
                displayInfo: true
            }]
        });

        me.callParent();

        me.on({
            afterrender: me.onAfterRender
        });
    },



    onAfterRender: function () {
        this.getStore().load();
    },


    hide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '212348763'
            || currentUserSso == '307006712'
            || currentUserSso == '307010290'
            || currentUserSso == '307010148'
            || currentUserSso == '307008440'
            || currentUserSso == '307009101'
            || currentUserSso == '307009217'
            || currentUserSso == '307009296'
            || currentUserSso == '307004910'
            || currentUserSso == '307007764'
            || currentUserSso == '307004931'
            || currentUserSso == '307008219'
            || currentUserSso == '307004909'
            || currentUserSso == '307004912'
            || currentUserSso == '307004930'
            || currentUserSso == '307004913'
            || currentUserSso == '307004976'
            || currentUserSso == '307005032'
            || currentUserSso == '307007391'
            || currentUserSso == '307006697'
            || currentUserSso == '307006478'
            || currentUserSso == '307008805'
            || currentUserSso == '307004996'
            || currentUserSso == '307004991'
            || currentUserSso == '307004947'
            || currentUserSso == '307010147'
            || currentUserSso == '307010291'
            || currentUserSso == '307008439'
            || currentUserSso == '307004938'
            || currentUserSso == '307009643'
            || currentUserSso == '307008304'
            || currentUserSso == '307005073'
            || currentUserSso == '307005982'
            || currentUserSso == '307010145'
            || currentUserSso == '307009219'
            || currentUserSso == '307005973'
            || currentUserSso == '307004934'
            || currentUserSso == '307004962'
            || currentUserSso == '307005109'
            || currentUserSso == '307004959'
            || currentUserSso == '307006094'
            || currentUserSso == '307010115'
            || currentUserSso == '212408440'
            || currentUserSso == '307009709'
            || currentUserSso == '307006631'

            ) {
            return false;
        } else {
            return true;
        }
    }

});