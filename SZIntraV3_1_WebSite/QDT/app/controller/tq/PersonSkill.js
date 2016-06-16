Ext.define('QDT.controller.tq.PersonSkill', {
    extend: 'Ext.app.Controller',
    stores: [
    //        'QDT.store.tq.PersonSkillCounts'
    //        ,
    //        'QDT.store.tq.PersonCertifiedSkills',
    //        'QDT.store.tq.PersonProcessSkills'
    ],
    views: [
        'QDT.view.tq.PersonSkillPanel'
    ],
    refs: [{
        ref: 'personSkillCountGrid',
        selector: 'tq-personskillpanel tq-personskillcountgrid'
    }, {
        ref: 'personCertificationGrid',
        selector: 'tq-personskillpanel tq-certificationbasegrid'
    }, {
        ref: 'personTrainingGrid',
        selector: 'tq-personskillpanel tq-skilltraininggrid'
    }],

    init: function () {
        var me = this;

        me.control({
            'tq-personskillpanel tq-personskillcountgrid': {
                afterrender: function (cmp) {
                    cmp.store.load();
                },
                selectionchange: function (selModel, selected) {
                    var grid = me.getPersonSkillCountGrid(),
                        record = selected.length === 1 ? selected[0] : {},
                        employeeId,
                        certifiedStore = me.getPersonCertificationGrid().store,
                        trainingStore = me.getPersonTrainingGrid().store;
                    grid.activeRecord = record;
                    employeeId = me.getEmployeeId();
                    if (employeeId) {
                        Ext.apply(certifiedStore.proxy.extraParams, {
                            employee_id: employeeId
                        });
                        Ext.apply(trainingStore.proxy.extraParams, {
                            employee_id: employeeId
                        });
                        certifiedStore.load();
                        trainingStore.load();
                    } else {
                        certifiedStore.removeAll();
                        trainingStore.removeAll();
                    }

                }
            },

            'tq-personskillpanel tq-certificationbasegrid': {
                afterrender: function (cmp) {
                    var store = cmp.store;
                    store.mon(store, {
                        destroyable: true,
                        beforeload: function () {
                            //TODO: there's a bug not fixed for Ext JS. if return false, the load action will be canceled but the laoding mask won't be unmasked automatically
                            Ext.apply(store.proxy.extraParams, {
                                filter_status: cmp.down('[name=filter_status]').getValue(),
                                status: cmp.down('[name=status]').getValue(),
                                working_group_id: null
                            });
                        }
                    });
                },
                selectionchange: function (selModel, selected) {
                    if (selected.length == 0) {
                        return;
                    }
                    var certificationId = selected[0].data.id;
                    var attachmentCmp = cq.query('tq-trainerattachmentlist #attachment_list')[0];
                    attachmentCmp.removeAll();
                    DpTq.GetTrainerAttachments(certificationId, function (result) {
                        if (result.success) {
                            var attachments = result.data;
                            var index = 0;
                            if (attachments.length != 0) {
                                Ext.Array.each(attachments, function (attachment) {
                                  
                                    attachmentCmp.insert(++index, Ext.create('Ext.container.Container', {
                                        layout: 'hbox',
                                        items: [{
                                            xtype: 'box',
                                            style: "padding: 3px",
                                            autoEl: {
                                                tag: 'a',
                                                href: '#',
                                                cn: attachment.file_name
                                            }, listeners: {
                                                render: function (component) {
                                                    component.getEl().on('click', function (e) {
                                                        var url = '../../DpTq/DownloadTrainerAttachment?attachmentFullFileName=' + attachment.file_name;
                                                        window.open(url);
                                                    });
                                                }
                                            }
                                        }]
                                    }));
                                });
                            }
                        } else {
                            My.Msg.warning(result.errorMessage);
                        }
                    });
                }
            },

            'tq-personskillpanel tq-skilltraininggrid': {
                afterrender: function (cmp) {

                }
            }

        });
    },

    //load nothing if employee id is not specified
    getEmployeeId: function () {
        var me = this,
            record = me.getPersonSkillCountGrid().activeRecord,
            employeeId = Ext.Object.equals(record, {}) ? 0 : record.data.employee_id;
        return employeeId;
    }
});