Ext.define('QDT.view.IRDHeaderInformationForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.irdheaderinformationform',
 
    frame : true,
    api: { submit: DpIrd.GenerateIrd },
    layout: {
        type: 'vbox'
    },
    defaults: {
        xtype: 'container',
        margin: '5 10 0 10'
    },
    items: [{
        xtype: 'container',
        flex: 1,
        layout: 'hbox',
        defaults: {
            xtype: 'textfield',
            margin: '5 5 0 5'
            // flex: 1
        },
        items: [{
            name: 'serial',
            fieldLabel: Profile.getText('serial'),
            labelWidth: 55
        }, {
            name: 'forging_num', 
            fieldLabel: 'Forging No.', // TODO: language
            labelWidth: 75
        }, {
            name: 'ri_num',
            fieldLabel: 'R.I. No.:', // TODO: language
            labelWidth: 50,
            width: 180
        }, {
            name: 'heat_code',
            fieldLabel: 'Heat Code', // TODO: language
            labelWidth: 65,
            width: 140
        }]
    }, {
        xtype: 'container',
        flex: 1,
        layout: 'hbox',
        defaults: {
            xtype: 'textfield',
            margin: '5 5 5 5'
        },
        items: [{
            name: 'part_num',
            fieldLabel: Profile.getText('part_num'),
            labelWidth: 80
        }, {
            name: 'job',
            fieldLabel: Profile.getText('job'),
            labelWidth: 40
        }, {
            name: 'suffix',
            fieldLabel: Profile.getText('suffix'),
            labelWidth: 35,
            width: 85
        }, {
            name: 'rev_level',
            fieldLabel: 'Rev. Level',  // TODO: language
            labelWidth: 60,
            width: 105
        }, {
            name: 'ird_revision',
            fieldLabel: Profile.getText('ird_revision'),
            labelWidth: 70,
            width: 135
        }]
    }]

});