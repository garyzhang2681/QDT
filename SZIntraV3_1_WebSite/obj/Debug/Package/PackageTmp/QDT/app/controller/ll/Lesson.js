Ext.define('QDT.controller.ll.Lesson', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.ll.LessonPanel',
        'QDT.view.ll.LessonList',
        'QDT.view.ll.LessonDetail',
        'QDT.view.ll.LessonEditor',
        'QDT.view.ll.LessonCreator',
        'QDT.view.ll.CategoryCombo',
        'QDT.view.ll.WorkingGroupCombo'
    ],
    stores: [

        'QDT.store.ll.Lessons'
    ],
    refs: [{
        ref: 'list',
        selector: 'll-lessonlist'
    }, {
        ref: 'detail',
        selector: 'll-lessondetail'
    }],

    init: function () {
        var me = this;

        me.control({
            'll-lessondetail #print': {
                click: {
                    buffer: 1000,
                    fn: me.onPrintLessonClick
                },
                scope: me
            },
            'll-lessonlist': {
                selectionchange: me.onLessonSelectionChange
            },

            'll-lessonlist #add': {
                click: {
                    buffer: 1000,
                    fn: me.onAddLessonClick
                },
                scope: me
            },

            'll-lessonlist #edit': {
                click: {
                    buffer: 1000,
                    fn: me.onEditLessonClick
                },
                scope: me
            },

            'll-lessonlist #delete': {
                click: me.onDeleteLessonClick,
                scope: me
            },

            'll-lessonlist #create': {
                click: {
                    buffer: 1000,
                    fn: me.onCreateLessonClick
                },
                scope: me
            },
            'll-lessonlist #clear': {
                click: me.onClearClick,
                scope: me
            },

            'll-lessonlist #search': {
                click: {
                    buffer: 1000,
                    fn: me.onSearchClick
                },
                scope: me
            }
        });
    },

    onLessonSelectionChange: function (selModel, selected) {
        var me = this,
            list = me.getList(),
            detail = me.getDetail(),
            record = selected[0] || {},
            isSelected = !Ext.Object.equals(record, {});
        list.activeRecord = record;
        list.down('#edit').setDisabled(!isSelected);
        list.down('#delete').setDisabled(!isSelected);
        list.down('#create').setDisabled(!isSelected);
        detail.getForm().reset();
        var attachmentBtn = detail.down('#view-attachment');
        if (isSelected) {
            detail.loadRecord(record);

            var lessonId = record.get('id');
            attachmentBtn.enable();
            var attachmentQuantity = record.get('attachment_quantity');
            attachmentBtn.setRefNum(lessonId);
            attachmentBtn.refreshText(attachmentQuantity);
        } else {

            attachmentBtn.disable();
            attachmentBtn.refreshText('');
        }
    },

    onAddLessonClick: function () {
        var me = this;
        me.application.fireEvent('showtab', 'll-lessoneditor', {
            title: Profile.getText('AddLesson'),
            saveMode: 'add',
            singleton: true
        });
    },

    onEditLessonClick: function () {
        var me = this,
            record = me.getList().getSelectionModel().getSelection()[0];
        me.application.fireEvent('showtab', 'll-lessoneditor', {
            title: Profile.getText('EditLesson'),
            saveMode: 'edit',
            singleton: false,
            record: record
        });
    },

    onDeleteLessonClick: function () {

        var me = this,
            id = me.getList().activeRecord.get('id');

        DpLl.InactiveLesson(id, function (result) {
            QDT.util.Util.generalCallbackCRUD(result, 'i');
            me.getList().getStore().load();
        });
    },


    onCreateLessonClick: function () {
        var me = this,
            id = me.getList().activeRecord.get('id'),
            record = me.getList().getSelectionModel().getSelection()[0];
        me.application.fireEvent('showtab', 'll-lessoncreator', {
            title: Profile.getText('CreateLesson'),
            singleton: false,
            record: record
        });
    },

    onClearClick: function () {


        var me = this;
        var list = me.getList();
        list.down('#search_lesson').getForm().reset();

        me.onSearchClick();
    },

    onSearchClick: function () {

        var me = this;
        var list = me.getList();

        list.getStore().load({
            // waitMsg : '正在加载数据请稍后',
            params: {
                search_conditions: list.down('#search_lesson').getForm().getValues()
            },
            callback: function (records, operation, success) {
                if (!success) {
                    My.Msg.warning('查询出错，请刷新页面重新操作，或者联系IT！');
                }
            }
        });


        //My.Msg.warning("查询错误，请刷新再试，或联系IT！");

    },

    onPrintLessonClick: function () {
        var me = this;
        var lesson_id = me.getList().selModel.getSelection()[0].data.id;
        var url = '../../DpLl/PrintLesson?lessonId=' + lesson_id;
        window.open(url);
    },

    searchLessons: function (working_group, part_num, business, category, subject, owner, creator) {

    }

    //    showAttachment: function (panel) {
    //        var me = this,
    //            lessonId = panel.down('[name=id]').getValue(),
    //            fileReference = { ref_type: 'lesson', ref_num: lessonId },
    //            store,
    //            browser,
    //            quantity,
    //            lesson;
    //        if (lessonId && lessonId !== '') {
    //            browser = Ext.widget('attachmentbrowser', {
    //                file_reference: fileReference,
    //                listeners: {
    //                    afterrender: function (cmp) {
    //                        store = cmp.down('grid').getStore();
    //                        Ext.apply(store.proxy.extraParams, fileReference);
    //                        store.load();
    //                    }
    //                }
    //            });
    //            browser.down('attachmentlist').getStore().mon(browser.down('attachmentlist').getStore(), {
    //            destroyable:true,
    //                datachanged: function () {
    //                    quantity = this.count();
    //                    me.resetAttachmentButtonText(panel.down('#view-attachment'), quantity);
    //                    if (panel.xtype === 'll-lessondetail') {
    //                        lesson = me.getList().getStore().getById(parseInt(lessonId));
    //                        lesson.set('attachment_quantity', quantity);
    //                    }
    //                }
    //            });
    //        }
    //    },

    //    resetAttachmentButtonText: function (button, quantity) {
    //  
    //       button.setText(Profile.getText('attachment') + ((quantity > 0) ? Ext.String.format('({0})', quantity) : ''));

    //    }
});