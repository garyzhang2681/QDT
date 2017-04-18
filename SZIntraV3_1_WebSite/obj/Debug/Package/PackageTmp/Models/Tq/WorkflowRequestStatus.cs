using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public enum WorkflowRequestStatus
    {
        Open,     //申请了一个workflow的request
        Canceled, //workflow中止，certification被设为Cancled
        Closed   //正常走完流程，Certification会变为active
    }
}