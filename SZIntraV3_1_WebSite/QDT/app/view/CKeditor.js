//Ext.define('QDT.view.CKeditor', {
//    extend: 'Ext.Component',
//    alias: 'widget.ckeditor',
//    cls: "xcke",
//    initComponent: function () {
//        this.html = "<textarea id='" + this.getId() + "-input' name='" + this.name + "'></textarea>";


//        this.on('afterrender', function () {
//           this.editor = CKEDITOR.replace(this.getId() + '-input');
//          //  this.editor = CKEDITOR.replace(this.name);
//        }, this);
//        this.callParent(arguments);
//    },
//    setValue: function (value) {
//        this.callParent(arguments);
//        if (this.editor) {
//            this.editor.setData(value);
//        }
//    },
//    getValue: function () {
//        return this.getRawValue();
//    },
//    getRawValue: function () {
//        if (this.editor) {
//            return this.editor.getData();
//        } else {
//            return ''
//        }
//    }
//});



Ext.define('QDT.view.CKeditor', 
{ extend: 'Ext.form.field.TextArea',
    alias: 'widget.ckeditor',
    xtype: 'ckeditor',
    initComponent: function () {
        this.callParent(arguments);
        this.on('afterrender', function () {
            Ext.apply(this.CKConfig, {
                height: this.getHeight()
            });
            this.editor = CKEDITOR.replace(this.inputEl.id, this.CKConfig);
            this.editorId = this.editor.id;
        }, this);
    },
    onRender: function (ct, position) {
        if (!this.el) {
            this.defaultAutoCreate = {
                tag: 'textarea',
                autocomplete: 'off'
            };
        }
        this.callParent(arguments)
    },
    setValue: function (value) {
        this.callParent(arguments);
        if (this.editor) {
            this.editor.setData(value);
        }
    },
    getRawValue: function () {
        if (this.editor) {
            return this.editor.getData()
        } else {
            return ''
        }
    }
});



CKEDITOR.on('instanceReady', function (e) {
    var o = Ext.ComponentQuery.query('ckeditor[editorId="' + e.editor.id + '"]'),
    comp = o[0];
    e.editor.resize(comp.getWidth(), comp.getHeight())
    comp.on('resize', function (c, adjWidth, adjHeight) {
        c.editor.resize(adjWidth, adjHeight)
    })
});





/**
* CKEDITOR 富文本编辑 
* @author wangxh2
*/
//QDT.view.CKEditor = Ext.extend(Ext.form.TextArea, {
//    hideLabel: true,
//    alias: 'widget.ckeditor',
//    constructor: function (config) {
//        config = config || {};
//        config.listeners = config.listeners || {};
//        Ext.applyIf(config.listeners, {
//            beforedestroy: this.onBeforeDestroy
//					.createDelegate(this),
//            scope: this
//        });
//        MAP.ui.form.CKEditor.superclass.constructor.call(this, config);
//    },

//    onBeforeDestroy: function () {
//        var instance = CKEDITOR.instances[this.id];
//        if (instance) {
//            instance.destroy();
//        }
//    },

//    onRender: function (ct, position) {
//        if (!this.el) {
//            this.defaultAutoCreate = {
//                tag: "textarea",
//                autocomplete: "off"
//            };
//        }
//        MAP.ui.form.CKEditor.superclass.onRender.call(this, ct, position);
//        var billForm = MAP_Util.getCurrentBillForm(),
//    		grow = billForm && billForm.useFlowLayout;
//        this.grow = grow;
//        if (grow) {
//            this.el.addClass('x-overflow-hidden');
//        }
//        (function () {
//            this.ckEditor = CKEDITOR.replace(this.id, {
//                toolbarCanCollapse: false,
//                resize_enabled: false,
//                readOnly: this.disabled,
//                width: this.getWidth(),
//                height: this.getHeight() - 90,
//                __key: this.__key
//            });
//            delete (CKEDITOR.focusManager._.blurDelay);
//            var top = this.el.dom.style.top;
//            var left = this.el.dom.style.left;
//            var container = this.ckEditor.container;
//            if (container) {
//                container.$.style.position = 'absolute';
//                container.$.style.top = top;
//                container.$.style.left = left;
//            }
//            this.ckEditor.on('uiReady', function () {
//                this.container.$.style.position = 'absolute';
//                this.container.$.style.top = top;
//                this.container.$.style.left = left;
//            });

//            this.ckEditor.on('blur', function () {
//                MAP_BillContext.appendSetHeadValue(this.config.__key, CKEDITOR.instances[this.name].getData(), false);
//            });
//        }).defer(1, this);
//    },

//    setValue: function (value) {
//        if (Ext.isEmpty(value)) {
//            value = "";
//        }
//        var instance = CKEDITOR.instances[this.id];
//        if (instance) {
//            instance.setData(value);
//        }
//        MAP.ui.form.CKEditor.superclass.setValue.apply(this, [value]);
//    },

//    getValue: function () {
//        var instance = CKEDITOR.instances[this.id];
//        if (instance) {
//            instance.updateElement();
//            this.value = instance.getData();
//        }
//        return MAP.ui.form.CKEditor.superclass.getValue.apply(this);
//    },

//    getRawValue: function () {
//        var instance = CKEDITOR.instances[this.id];
//        if (instance) {
//            instance.updateElement();
//            this.value = instance.getData();
//        }
//        return MAP.ui.form.CKEditor.superclass.getRawValue.apply(this);
//    },

//    setDisabled: function (isReadOnly) {
//        if (this.ckEditor)
//            this.ckEditor.setReadOnly(isReadOnly);
//    }
//});
