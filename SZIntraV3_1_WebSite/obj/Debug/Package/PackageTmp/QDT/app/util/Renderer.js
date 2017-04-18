(function () {
    Ext.ns('QDT.util');

    QDT.util.Renderer = {};

    var renderer = QDT.util.Renderer;

    Ext.apply(renderer, {
        booleanRenderer: function (value) {
            if (value === undefined) {
                return "&#160;";
            } else if (value === null) {
                return "N/A";
            } else if (!value || value === 'false') {
                return Profile.getText('No');
            } else {
                return Profile.getText('Yes');
            }
        },

        booleanIconRenderer: function (value, meta) {
            var addtionalClass = 'cell-image-single',
                flag = false;
            if (value === undefined) {
            } else if (value === null) {
            } else if (!value || value === 'false') {
            } else {
                flag = true;
            }
            if (flag) {
                addtionalClass += ' circle_yes';
            } else {
                addtionalClass += ' circle_no';
            }
            meta.tdCls = addtionalClass;
            return '';
        },

        dateTimeRenderer: function (v) {
            if (v === null || v === '') {
                return '';
            }
            if (!Ext.isDate(v)) {
                v = new Date(v);     // new Date(v) => 1970-01-01 00:00:00
            }
            return Ext.Date.format(v, 'Y-m-d H:i');
        },

        dateRenderer: function (v) {
            if (v === null || v === '') {
                return '';
            }
            if (!Ext.isDate(v)) {
                v = new Date(v);
            }
            return Ext.Date.format(v, 'Y-m-d');
        },

        ellipsis: function (length, word) {
            return function (v) {
                return Ext.String.ellipsis(v, length, word);
            }
        },

        business: function (v) {
            v = v || '';
            return Ext.util.Format.capitalize(v);
        },

        trainingDueDate: function (value, metaData, record) {
            if (record.data.month_remaining <= 2) {
                metaData.tdAttr = 'style="color:#FAA732"';
            }
            return Ext.Date.format(value, 'Y-m-d');
        },

        skillStatusRenderer: function (v, meta, rec) {
            var currentStep = rec.data.current_step;
            if (v > currentStep) {
                meta.tdCls = 'circle_grey cell-image-single';
                meta.tdAttr = Ext.String.format('title="{0}"', Profile.getText('stepStatus_Open'));
            }
            else if (v == currentStep) {
                meta.tdCls = 'circle_yellow cell-image-single';
                meta.tdAttr = Ext.String.format('title="{0}"', Profile.getText('stepStatus_Pending'));
            }
            else {
                meta.tdCls = 'circle_green cell-image-single';
                meta.tdAttr = Ext.String.format('title="{0}"', Profile.getText('stepStatus_Approved'));
            }
            return '';
        },

        certificationExpireDateRenderer: function (v, meta) {
            if (v > Ext.Date.add(new Date(), Ext.Date.DAY, 10)) {
                meta.tdCls = 'font-green';
            }
            else if (v > new Date()) {
                meta.tdCls = 'font-ed8000';
            }
            else {
                meta.tdCls = 'font-red';
            }

            return renderer.dateRenderer(v);
        },

        findExactRecordValue: function (storeId, queryKey, queryValue, key) {
            var store = Ext.getStore(storeId),
            record,
            value;

            if (store.data.items.length == 0) {
                store.load({
                    callback: function (records, operation, success) {
                        record = store.findRecord(queryKey, queryValue, 0, false, false, true);
                        if (record) {
                            value = record.get(key);
                        }
                        return value;
                    }
                });
            } else {
                record = store.findRecord(queryKey, queryValue, 0, false, false, true);
                if (record) {
                    value = record.get(key);
                }
                return value;
            }

        },

        //used for both column(value is int) render and display field(value can be string) render, so have to parse value before if condition
        username: function (v) {
            return renderer.findExactRecordValue('Asz.store.system.Users', 'user_id', v, 'name') || '';
        },

        localId: function (v) {
            return renderer.findExactRecordValue('Asz.store.hr.Employees', 'employee_id', v, 'local_id') || '';
        },

        usernames: function (v) {
            var usernames = [];
            if (v && v.length > 0) {
                Ext.Array.each(v.split(','), function (userId) {
                    usernames.push(renderer.username(userId));
                });
            }
            return usernames.join('<br/>');
        },

        employeeName: function (v) {
            return renderer.findExactRecordValue('Asz.store.hr.Employees', 'employee_id', v, 'name') || '';
        },

        //1,2,3
        employeeNames: function (v) {
            var employeeNames = [];
            if (v && v.length > 0) {
                Ext.Array.each(v.split(','), function (employeeId) {
                    employeeNames.push(renderer.employeeName(employeeId));
                });
            }
            return employeeNames.join('<br/>');
        },

        getLocalIdByEmployeeId: function (v) {
            return renderer.findExactRecordValue('QDT.store.hr.Employees', 'employee_id', v, 'local_id') || '';
        },

        lessonCategory: function (v) {
            return renderer.findExactRecordValue('QDT.store.ll.Categories', 'id', v, 'category') || '';
        },

        ccType: function (v) {
            return renderer.findExactRecordValue('QDT.store.cc.CcTypes', 'id', v, 'common_string') || '';

        },

        ccFailureCode: function (v) {
            return renderer.findExactRecordValue('QDT.store.cc.CcFailureCodes', 'id', v, 'common_string') || '';
        },

        ccIndicateFinding: function (v) {
            return renderer.findExactRecordValue('QDT.store.cc.CcIndicateFindings', 'id', v, 'common_string') || '';
        },

        wcDescription: function (v) {
            return renderer.findExactRecordValue('Asz.store.op.WorkCenters', 'wc', v, 'description') || '';
        },

        workType: function (v) {
            return renderer.findExactRecordValue('Asz.store.op.WorkTypes', 'work_type', v, 'work_type_string') || '';
        },

        certificationStatus: function (v) {
            return renderer.findExactRecordValue('QDT.store.tq.CertificationStatus', 'status', v, 'status_string') || '';
        },

        certificationCategory: function (v) {

            return renderer.findExactRecordValue('QDT.store.tq.CertificationCategories', 'category', v, 'category_string') || '';
        },


        workflowProcessStatus: function (v) {
            return renderer.findExactRecordValue('QDT.store.tq.WorkflowProcessStatus', 'status', v, 'status_string') || '';
        },

        workflowCategory: function (v) {
            return renderer.findExactRecordValue('QDT.store.tq.WorkflowCategories', 'category', v, 'category_string') || '';
        },

        workflowAction: function (v) {
            return renderer.findExactRecordValue('QDT.store.tq.WorkflowActionTypes', 'process_action', v, 'action_name') || '';
        }
    });
})();