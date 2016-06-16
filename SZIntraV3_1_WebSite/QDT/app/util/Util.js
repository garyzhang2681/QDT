(function () {
    Ext.ns('QDT.util');
    QDT.util.Util = {};
    var Util = QDT.util.Util;
    Ext.apply(Util, {
        downloadAttachment: function (id) {
            window.open(Ext.String.format('http://{0}/DpUtil/DownloadAttachment?id={1}', window.location.host, id));
        },

        showErrorMessage: function (msg) {
            if (Profile && Profile.getText(msg)) {
                msg = Profile.getText(msg);
            }
            Ext.Msg.show({
                title: Profile.getText('Error'),
                msg: msg,
                width: 300,
                buttons: Ext.Msg.OK,
                icon: Ext.window.MessageBox.ERROR
            });
        },

        showInfoMessage: function (title, msg) {
            Ext.Msg.show({
                title: title,
                msg: msg,
                width: 300,
                buttons: Ext.Msg.OK,
                icon: Ext.window.MessageBox.INFO
            });
        },

        generalFormSubmitFailureHandler: function (form, action) {
            //TODO: localization
            switch (action.failureType) {
                case Ext.form.action.Action.CLIENT_INVALID:
                    Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                    break;
                case Ext.form.action.Action.CONNECT_FAILURE:
                    Ext.Msg.alert('Failure', 'Ajax communication failed');
                    break;
                case Ext.form.action.Action.SERVER_INVALID:
                    Ext.Msg.alert('Failure', action.result.errorMessage);
            }
        },

        generalDirectCallback: function (result) {
            if (!result.success) {
                QDT.util.Util.showErrorMessage(result.errorMessage);
            }
        },

        generalCallbackCRUD: function (result, action) {
            var me = this;
            if (result.success) {
                var title = Profile.getText('Success');
                switch (action.toLowerCase()) {
                    case 'c': me.showInfoMessage(title, Profile.getText('txtRecordCreated')); break;
                    case 'u': me.showInfoMessage(title, Profile.getText('txtRecordUpdated')); break;
                    case 'd': me.showInfoMessage(title, Profile.getText('txtRecordDeleted')); break;
                    case 'i': me.showInfoMessage(title, Profile.getText('txtRecordInactived')); break;
                    default: break;
                }
            } else {
                QDT.util.Util.showErrorMessage(result.errorMessage);
            }
        },

        dummyCheckAdministrator: function () {
            var sso = Profile.getUserSso(),
                flag = (sso === '307009509');
            return flag;
        },

        findInRecordArray: function (records, key, value) {
            var result = [];
            Ext.Array.each(records, function (record) {
                if (Util.isMatchedRecord(record, key, value)) {
                    result.push(record);
                }
            });
            return result;
        },

        isMatchedRecord: function (record, key, value) {
            return record.get(key) === value;
        },

        getCurrentUserEmployeeId: function () {
            var sso = Profile.getUserSso(),
                store = Ext.getStore('Asz.store.hr.Employees'),
                employeeId = store.findRecord('sso', sso, 0, false, false, true).data.employee_id;
            return employeeId;

        },

        prompt: function (msg, fn) {
            Ext.Msg.show({
                title: Profile.getText('Info'),
                msg: msg,
                buttons: Ext.Msg.OKCANCEL,
                multiline: 3,
                fn: fn
            });
        },

        nonEmptyString: function (str) {
            return str && str.length !== 0;
        },

        getRecordsData: function (records) {
            var array = [];
            for (var i = 0; i < records.length; i++) {
                array.push(records[i].data);
            }
            return array;
        }
      
    });

})();