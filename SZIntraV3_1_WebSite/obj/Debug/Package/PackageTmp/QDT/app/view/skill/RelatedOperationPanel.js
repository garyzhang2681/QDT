Ext.define('QDT.view.skill.RelatedOperationPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.skill-relatedoperationpanel',
    requires: [
        'QDT.view.skill.RelatedOperationGrid',
        'QDT.view.op.OperationGrid'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            title: Profile.getText('RelatedOperation'),
            items: [{
                minHeight: 200,
                flex: 1,
                itemId: 'related-operations',
                xtype: 'skill-relatedoperationgrid',
                viewConfig: {
                    enableTextSelection: true,
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragGroup: 'list-of-operations',
                        dropGroup: 'related-operations',
                        ddGroup: 'binding-skill-operation',
                        enableDrag: false
                    },
                    listeners: {
                        beforedrop: function (node, data, overModel, dropPosition, dropHandlers) {
                            dropHandlers.wait = true;
                            var relatedOperationGrid = this.up('grid'),
                                relatedOperationStore = relatedOperationGrid.store,
                                notDuplicatedRecords = [],
                                notDuplicatedIds = [];
                            skillCodeId = relatedOperationGrid.skill_code_id;
                            if (!skillCodeId) {
                                dropHandlers.cancelDrop();
                                Ext.Msg.alert(Profile.getText('Warning'), Profile.getText('txtSkillCodeNotAssigned'))
                            } else {
                                Ext.Array.each(data.records, function (record) {
                                    if (!relatedOperationStore.findRecord('id', record.data.id, 0, false, false, true)) {
                                        notDuplicatedRecords.push(record);
                                        notDuplicatedIds.push(record.data.id);
                                    }
                                });
                                DpSkill.AddRelatedOperations(skillCodeId, notDuplicatedIds, function (result) {
                                    if (result.success) {
                                        data.records = notDuplicatedRecords;
                                        dropHandlers.processDrop();
                                    } else {
                                        QDT.util.Util.showErrorMessage(result.errorMessage);
                                        dropHandlers.cancelDrop();
                                    }
                                });

                            }
                        }
                    }
                }
            }, {
                xtype: 'splitter'
            }, {
                flex: 1,
                itemId: 'list-of-operations',
                xtype: 'op-operationgrid',
                hidden:me.hide(),
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dropGroup: 'list-of-operations',
                        dragGroup: 'related-operations',
                        ddGroup: 'binding-skill-operation',
                        enableDrop: false
                    }
                },
                bbar: ['->', {
                    xtype: 'tbtext',
                    cls: 'highlight-add566',
                    text: Profile.getText('noteDragBindingRelatedOperation')
                }]
            }]
        });


        me.callParent();
    },

    hide: function () {
        var currentUserSso = Profile.getUserSso();
        if (currentUserSso == '212348763'
            || currentUserSso == '307006712'
            || currentUserSso == '307010290'
            || currentUserSso == '307006710'
            ) {
            return false;
        } else {
            return true;
        }
    }
});