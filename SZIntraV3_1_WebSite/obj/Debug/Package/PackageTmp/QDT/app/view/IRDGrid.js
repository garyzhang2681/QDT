 /// <reference path="../../../extjs/ext.js" />

Ext.define('QDT.view.IRDGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.irdgrid',
    save_all: false,
    scroll: true,
    sso: '',
    gridName: 'irdCharacteristicGrid',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            columns: [{
                text: Profile.getText('char_num'),
                dataIndex: 'char_num',
                width: 60,
                sortable:false,
                menuDisabled: true
            }, {
                text: Profile.getText('description'),
                dataIndex: 'char_description',
                flex: 25,
                menuDisabled: true
            }, {
                text: Profile.getText('characteristic'),
                id: 'char_others',
                dataIndex: 'char_others',
                width: 'auto',
                hidden: true,
                flex: 25,
                menuDisabled: true
            }, {
                text: Profile.getText('characteristic'),
                id: 'char_fml',
                dataIndex: 'char_fml',
                width: 'auto',
                hidden: true,
                flex: 25,
                menuDisabled: true
            }, {
                text: Profile.getText('fml_mark'),
                id: 'fml_mark',
                dataIndex: 'fml_mark',
                flex: 5,
                hidden: true,
                menuDisabled: true

            }, {
                text: Profile.getText('oai_flag'),
                dataIndex: 'oai_flag',
                hidden: true,
                menuDisabled: true
            }, {
                text: Profile.getText('oap_flag'),
                dataIndex: 'oap_flag',
                width: 30,
                renderer: oapRenderer,
                menuDisabled: true
            }, {
                text: Profile.getText('is_cmm_flag'),
                dataIndex: 'is_cmm_flag',
                hidden: true,
                menuDisabled: true
            }, {
                text: Profile.getText('char_minimum'),
                dataIndex: 'char_minimum',
                hidden: true,
                menuDisabled: true
            }, {
                text: Profile.getText('char_maximum'),
                dataIndex: 'char_maximum',
                hidden: true,
                menuDisabled: true
            }, {
                text: Profile.getText('OperatorResult'),
                id: 'operator_basic_rec_type',
                dataIndex: 'basic_rec_type',
                renderer: operatorTemplateRenderer,
                hidden: true,
                width: 150,
                menuDisabled: true
            }, {
                text: Profile.getText('OperatorResult'),
                id: 'operator_fml_rec_type',
                dataIndex: 'fml_rec_type',
                renderer: fmlOperatorTemplateRenderer,
                hidden: true,
                width: 150,
                menuDisabled: true

            }, {
                text: Profile.getText('save'),
                renderer: operatorSaveRenderer,
                width: 60,
                menuDisabled: true
            }, {
                text: Profile.getText('InspectorResult'),
                id: 'inspector_basic_rec_type',
                dataIndex: 'basic_rec_type',
                renderer: inspectorTemplateRenderer,
                hidden: true,
                width: 150,
                menuDisabled: true

            }, {
                text: Profile.getText('InspectorResult'),
                id: 'inspector_fml_rec_type',
                dataIndex: 'fml_rec_type',
                renderer: fmlInspectorTemplateRenderer,
                width: 150,
                hidden: true,
                menuDisabled: true
            }, {
                header: Profile.getText('save'),
                renderer: inspectorSaveRenderer,
                width: 60,
                menuDisabled: true
            }, {
                text: Profile.getText('char_type'),
                dataIndex: 'char_type',
                flex: 10,
                menuDisabled: true
            }, {
                text: Profile.getText('blue_print_zone'),
                dataIndex: 'blue_print_zone',
                flex: 10,
                menuDisabled: true
            }, {
                text: Profile.getText('gage'),
                id: 'basic_gage',
                dataIndex: 'basic_gage',
                flex: 25,
                menuDisabled: true
            }, {
                text: Profile.getText('gage'),
                id: 'fml_gage',
                dataIndex: 'fml_gage',
                flex: 25,
                menuDisabled: true
            }
            //    , {
            //        header: 'DR',
            //        renderer: drRenderer
            //    }
    ]
        });

        //        me.tbar = [{
        //            xtype: 'button',
        //            id: 'collapse_all',
        //            disabled: true,
        //            text: Profile.getText('CollapseAll')
        //        }, {
        //            xtype: 'button',
        //            id: 'expand_all',
        //            disabled: false,
        //            text: Profile.getText('ExpandAll')
        //        }, '->', {
        //            xtype: 'button',
        //            text: 'Toggle',
        //            destroyMenu: true,
        //            menu: me.toggleMenu

        //        }];


        me.tbar = [
        {
            xtype: 'radiogroup',
            id: 'fmlgroup',
            width: 280,
            layout: 'hbox',
            defaults: {
                name: 'fml',
                flex: 1
            },
            disabled: true,
            items: [
                {
                    inputValue: 'first',
                    boxLabel: Profile.getText('First')
                }, {
                    inputValue: 'middle',
                    boxLabel: Profile.getText('Middle')
                }, {
                    inputValue: 'last',
                    boxLabel: Profile.getText('Last')
                }, {
                    inputValue: 'others',
                    boxLabel: Profile.getText('Others')
                }
            ]
        }, {
            xtype: 'textfield',
            fieldLabel: Profile.getText('sso'),
            id: 'SSO',
            labelWidth: 20
        }, '->', {
            xtype: 'button',
            text: Profile.getText('SaveAll'),
            id: 'save_all',
            disabled: true
        }, {
            xtype: 'button',
            text: Profile.getText('CreateDR'),
            id: 'create_dr'
        }
        //        ,'->', {
        //            xtype: 'radiogroup',
        //            width: 280,
        //            layout: 'hbox',
        //            defaults: {
        //                name: 'inspect_type',
        //                flex: 1
        //            },
        //            items: [{
        //                inputValue: '1',
        //                boxLabel: 'operator'
        //            }, {
        //                inputValue: '2',
        //                boxLabel: 'inspector'
        //            }, {
        //                inputValue: '3',
        //                boxLabel: 'CMM'
        //            }]
        //        }
    ];
        me.bbar = [
        {
            xtype: 'form',
            itemId: 'comment_form',
            api: { submit: DpIrd.UpdateComments },
            frame: true,
            border: false,
            width: 862,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
            {
                xtype: 'container',
                layout: 'hbox',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: Profile.getText('operation'),
                    itemId: 'oper_num',
                    name: 'oper_num',
                    width: 60,
                    labelWidth: 30,
                    submitValue: true
                }, {
                    xtype: 'displayfield',
                    fieldLabel: Profile.getText('serial'),
                    itemId: 'serial',
                    name: 'serial',
                    width: 120,
                    labelWidth: 40,
                    submitValue: true
                }]
            }, {
                xtype: 'textarea',
                itemId: 'comment1',
                name: 'comment1',
                fieldLabel: Profile.getText('comment') + '1',
                flex: 1
            }, {
                xtype: 'textarea',
                itemId: 'comment2',
                name: 'comment2',
                fieldLabel: Profile.getText('comment') + '2',
                flex: 1
            }],
            buttons: [{
                xtype: 'button',
                text: Profile.getText('Submit'),
                handler: function () {
                    this.up('form').submit({
                        success: function (form, action) {
                            Ext.Msg.alert('提示', '备注添加成功');
                        },
                        failure: function (form, action) {
                            Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                        }
                    })
                }
            }]
        }
        ];

        me.callParent();

    }

});

function firstSecondRenderer(value, meta, record, rowIndex, columnIndex, view) {
    var template = new Ext.Template("<INPUT type='radio' id='first' value='true' name='firstsecond_{ird_route_id}'>初检 <input type='radio'  value='false' id='second' name='firstsecond_{ird_route_id}'>复检");
    return template.applyTemplate(record.data);
}

function operatorSaveRenderer(value, meta, record, rowIndex, columnIndex, view) {
    var template = new Ext.Template();

    if (record.data['operator_sso'] != null) {
        template = new Ext.Template("{operator_name}");
    } else if ((record.data['oai_flag'] && !record.data['is_cmm_flag'])) {
        template = new Ext.Template("<INPUT type='button' id='operator_save_{ird_route_id}' class='operator_save' value='Save' text='Save'>");
    } else {
        template = new Ext.Template("N/A");
    }

    return template.applyTemplate(record.data);
}

function inspectorSaveRenderer(value, meta, record, rowIndex, columnIndex, view) {
    var template = new Ext.Template();

    if (record.data['fml_mark'] != 'others' || record.data['oai_flag'] === false) {
        if (record.data['inspector_sso'] != null) {
            template = new Ext.Template("{inspector_name}");
        } else {
            template = new Ext.Template("<INPUT type='button' id='inspector_save_{ird_route_id}' class='inspector_save' value='Save' text='Save'>");
        }
    } else {
        template = new Ext.Template("N/A");
    }

    return template.applyTemplate(record.data);
}


function drRenderer(value, meta, record, rowIndex, columnIndex, view) {
    var template = new Ext.Template("<INPUT type='button' id='createDr' class='createDr' value='Create DR'>");
    return template.applyTemplate(record.data);
}

function fmlOperatorTemplateRenderer(value, meta, record, rowIndex, columnIndex, view) {

    var template = new Ext.Template();

    // console.log(record.data['char_seq'] + '%%%%%%%' + record.data['operator_trans_num'] + '%%%%%%%' + record.data['operator_inspect_type']);
    if (record.data['operator_trans_num'] != null && record.data['operator_inspect_type'] === '0') {
        if (value === 'range') { // range
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='fml_operator_min_{ird_route_id}' style='width:70px' class='fml_operator_min_{ird_route_id}' value={operator_rec_minimum} disabled=true> <label for='max'>Max:</label><INPUT type='text' id='fml_operator_max_{ird_route_id}' style='width:70px' class='fml_operator_max_{ird_route_id}' value={operator_rec_maximum} disabled=true> ");
        } else if (value === 'value') {   // value 
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='fml_operator_value_{ird_route_id}' style='width:70px' class='fml_operator_value_{ird_route_id}' value={operator_rec_value} disabled=true>");
        } else if (value === 'pass') {   // pass
            if (record.data['operator_rec_passed'] === true) {
                template = new Ext.Template("<INPUT type='radio' id='fml_operator_passed_{ird_route_id}' name='fml_operator_pass_{ird_route_id}' value=true checked='checked' disabled=true>Accept <INPUT type='radio' id='fml_operator_notPassed_{ird_route_id}' name='fml_operator_pass_{ird_route_id}' value=false disabled=true>Reject");
            } else if (record.data['operator_rec_passed'] === false) {
                template = new Ext.Template("<INPUT type='radio' id='fml_operator_passed_{ird_route_id}' name='fml_operator_pass_{ird_route_id}' value=true disabled=true>Accept <INPUT type='radio' id='fml_operator_notPassed_{ird_route_id}' name='fml_operator_pass_{ird_route_id}' value=false checked='checked' disabled=true>Reject");
            }
        }
    } else if (record.data['oai_flag'] && !record.data['is_cmm_flag']) {
        if (value === 'range') { // range
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='fml_operator_min_{ird_route_id}' style='width:70px' class='fml_operator_min_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})'  value={rate}> <label for='max'>Max:</label><INPUT type='text' id='fml_operator_max_{ird_route_id}' style='width:70px' class='fml_operator_max_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})'  value={rate}> ");
        } else if (value === 'value') {   // value 
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='fml_operator_value_{ird_route_id}' style='width:70px' class='fml_operator_value_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})'  value={rate}>");
        } else if (value === 'pass') {   // pass
            template = new Ext.Template("<INPUT type='radio' id='fml_operator_passed_{ird_route_id}' name='fml_operator_pass_{ird_route_id}' value=true>Accept <INPUT type='radio' id='fml_operator_notPassed_{ird_route_id}' name='fml_operator_pass_{ird_route_id}' value=false>Reject");
        }
    } else {
        template = new Ext.Template("N/A");
    }
    return template.applyTemplate(record.data);
}

function fmlInspectorTemplateRenderer(value, meta, record, rowIndex, columnIndex, view) {
    var template = new Ext.Template();
    //console.log(record.data['char_seq'] + '@@@@@@@@'+record.data['inspector_trans_num'] + '%%%%%%%%%' + record.data['inspector_inspect_type']);
    if (record.data['inspector_trans_num'] != null && record.data['inspector_inspect_type'] != 0) {
        if (value === 'range') {
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='fml_inspector_min_{ird_route_id}' style='width:70px' class='fml_inspector_min_{ird_route_id}' value={inspector_rec_minimum} disabled=true> <label for='max'>Max:</label><INPUT type='text' id='fml_inspector_max_{ird_route_id}' style='width:70px' class='fml_inspector_max_{ird_route_id}' value={inspector_rec_maximum} disabled=true> ");
        } else if (value === 'value') {
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='fml_inspector_value_{ird_route_id}' style='width:70px' class='fml_inspector_value_{ird_route_id}' value={inspector_rec_value} disabled=true>");
        } else if (value === 'pass') {
            if (record.data['inspector_rec_passed'] === true) {
                template = new Ext.Template("<INPUT type='radio' id='fml_inspector_passed_{ird_route_id}' name='fml_inspector_pass_{ird_route_id}' value=true checked='checked' disabled=true>Accept <INPUT type='radio' id='fml_inspector_notPassed_{ird_route_id}' name='fml_inspector_pass_{ird_route_id}' value=false disabled=true>Reject");
            } else if (record.data['inspector_rec_passed'] === false) {
                template = new Ext.Template("<INPUT type='radio' id='fml_inspector_passed_{ird_route_id}' name='fml_inspector_pass_{ird_route_id}' value=true disabled=true>Accept <INPUT type='radio' id='fml_inspector_notPassed_{ird_route_id}' name='fml_inspector_pass_{ird_route_id}' value=false checked='checked' disabled=true>Reject");
            }
        }
    } else {
        if (value === 'range') {
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='fml_inspector_min_{ird_route_id}' style='width:70px' class='fml_inspector_min_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})'  value={rate}> <label for='max'>Max:</label><INPUT type='text' id='fml_inspector_max_{ird_route_id}' style='width:70px' class='fml_inspector_max_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})'  value={rate}> ");
        } else if (value === 'value') {
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='fml_inspector_value_{ird_route_id}' style='width:70px' class='fml_inspector_value_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})' value={rate}>");
        } else if (value === 'pass') {
            template = new Ext.Template("<INPUT type='radio' id='fml_inspector_passed_{ird_route_id}' name='fml_inspector_pass_{ird_route_id}' value=true>Accept <INPUT type='radio' id='fml_inspector_notPassed_{ird_route_id}' name='fml_inspector_pass_{ird_route_id}' value=false>Reject");
        }
    }
    return template.applyTemplate(record.data);
}


function operatorTemplateRenderer(value, meta, record, rowIndex, columnIndex, view) {

    var template = new Ext.Template();
    // console.log(record.data['char_seq'] + '@@@@@@@@' + record.data['inspector_trans_num'] + '%%%%%%%%%' + record.data['inspector_inspect_type']);
    if (record.data['operator_trans_num'] != null && record.data['operator_inspect_type'] == 0) {
        if (value === 'range') { // range
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='operator_min_{ird_route_id}' style='width:70px' class='operator_min_{ird_route_id}' value={operator_rec_minimum} disabled=true> <label for='max'>Max:</label><INPUT type='text' id='operator_max_{ird_route_id}' style='width:70px' class='operator_max_{ird_route_id}' value={operator_rec_maximum} disabled=true> ");
        } else if (value === 'value') {   // value 
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='operator_value_{ird_route_id}' style='width:70px' class='operator_value_{ird_route_id}' value={operator_rec_value} disabled=true>");
        } else if (value === 'pass') {   // pass
            if (record.data['operator_rec_passed'] === true) {
                template = new Ext.Template("<INPUT type='radio' id='operator_passed_{ird_route_id}' name='operator_pass_{ird_route_id}' value=true checked='checked' disabled=true>Accept <INPUT type='radio' id='operator_notPassed_{ird_route_id}' name='operator_pass_{ird_route_id}' value=false disabled=true>Reject");
            } else if (record.data['operator_rec_passed'] === false) {
                template = new Ext.Template("<INPUT type='radio' id='operator_passed_{ird_route_id}' name='operator_pass_{ird_route_id}' value=true disabled=true>Accept <INPUT type='radio' id='operator_notPassed_{ird_route_id}' name='operator_pass_{ird_route_id}' value=false checked='checked' disabled=true>Reject");
            }
        }
    } else if (record.data['oai_flag'] && !record.data['is_cmm_flag']) {

        if (value === 'range') { // range
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='operator_min_{ird_route_id}' style='width:70px' class='operator_min_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})' value={rate}> <label for='max'>Max:</label><INPUT type='text' id='operator_max_{ird_route_id}' style='width:70px' class='operator_max_{ird_route_id}'onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})'  value={rate}> ");
        } else if (value === 'value') {   // value 
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='operator_value_{ird_route_id}' style='width:70px' class='operator_value_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})' value={rate}  > ");
        } else if (value === 'pass') {   // pass
            template = new Ext.Template("<INPUT type='radio' id='operator_passed_{ird_route_id}' name='operator_pass_{ird_route_id}' value=true>Accept <INPUT type='radio' id='operator_notPassed_{ird_route_id}' name='operator_pass_{ird_route_id}' value=false>Reject");

        }
    } else {
        template = new Ext.Template("N/A");
    }
    return template.applyTemplate(record.data);
}

function inspectorTemplateRenderer(value, meta, record, rowIndex, columnIndex, view) {

    var template = new Ext.Template();
    // console.log('---------------------------------');
    // console.log(record.data['char_seq'] + '@@@@@@@@' + record.data['inspector_trans_num'] + '%%%%%%%%%' + record.data['inspector_inspect_type']);
    if (record.data['inspector_trans_num'] != null && record.data['inspector_inspect_type'] != 0) {
        if (value === 'range') {
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='inspector_min_{ird_route_id}' style='width:70px' class='inspector_min_{ird_route_id}' value={inspector_rec_minimum} disabled=true> <label for='max'>Max:</label><INPUT type='text' id='inspector_max_{ird_route_id}' style='width:70px' class='inspector_max_{ird_route_id}' value={inspector_rec_maximum} disabled=true> ");
        } else if (value === 'value') {
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='inspector_value_{ird_route_id}' style='width:70px' class='inspector_value_{ird_route_id}' value={inspector_rec_value} disabled=true> ");
        } else if (value === 'pass') {
            if (record.data['inspector_rec_passed'] === true) {
                template = new Ext.Template("<INPUT type='radio' id='inspector_passed_{ird_route_id}' name='inspector_pass_{ird_route_id}' value=true checked='checked' disabled=true>Accept <INPUT type='radio' id='inspector_notPassed_{ird_route_id}' name='inspector_pass_{ird_route_id}' value=false disabled=true>Reject");
            } else if (record.data['inspector_rec_passed'] === false) {
                template = new Ext.Template("<INPUT type='radio' id='inspector_passed_{ird_route_id}' name='inspector_pass_{ird_route_id}' value=true disabled=true>Accept <INPUT type='radio' id='inspector_notPassed_{ird_route_id}' name='inspector_pass_{ird_route_id}' value=false checked='checked' disabled=true>Reject");
            }
        }
    } else if (record.data['fml_mark'] != 'others' || record.data['oai_flag'] === false) {
        if (value === 'range') {
            template = new Ext.Template("<label for='min'>Min:</label><INPUT type='text' id='inspector_min_{ird_route_id}' style='width:70px' class='inspector_min_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})' value={rate}> <label for='max'>Max:</label><INPUT type='text' id='inspector_max_{ird_route_id}' style='width:70px' class='inspector_max_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})' value={rate}> ");
        } else if (value === 'value') {
            template = new Ext.Template("<label for='value'>Value:</label><INPUT type='text' id='inspector_value_{ird_route_id}' style='width:70px' class='inspector_value_{ird_route_id}' onBlur='validateInputValue(this.value,{char_minimum},{char_maximum})' value={rate}>");
        } else if (value === 'pass') {
            template = new Ext.Template("<INPUT type='radio' id='inspector_passed_{ird_route_id}' name='inspector_pass_{ird_route_id}' value=true>Accept <INPUT type='radio' id='inspector_notPassed_{ird_route_id}' name='inspector_pass_{ird_route_id}' value=false>Reject");
        }
    } else {
        template = new Ext.Template("N/A");
    }
    return template.applyTemplate(record.data);
}


function oapRenderer(value) {
    if (value == true) {
        return 'oap';
    }
    else {
        return '';
    }
}