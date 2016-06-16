/*
 * File: app/store/scan/OpHistory.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('QDT.store.scan.OpScanHistory', {
    extend: 'Ext.data.Store',

    requires: [
        'QDT.model.scan.OpScanHistory',
        'Ext.data.proxy.Direct',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'QDT.model.scan.OpHistory',
            storeId: 'scan.OpHistory',
            proxy: {
                type: 'direct',
                directFn: 'DpScan.GetOpHistory',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});