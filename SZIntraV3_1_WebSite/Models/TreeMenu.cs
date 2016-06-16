using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Utility
{
    public class TreeNode
    {
        //property naming obtain Ext JS node interface properties
        public string iconCls { get; set; }
        public string id { get; set; }
        public string text { get; set; }
        public string componentAlias { get; set; }
        public Boolean expanded { get; set; }
        public Boolean leaf { get; set; }
        public string href { get; set; }
        public string hrefTarget { get; set; }
    }

    public class TreeCheckNode : TreeNode
    {
        public bool @checked { get; set; }
    }

}