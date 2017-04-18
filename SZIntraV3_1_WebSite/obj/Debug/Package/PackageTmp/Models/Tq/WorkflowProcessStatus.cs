using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public enum WorkflowProcessStatus
    {
        Approved, // 当前步骤完成，并被批准
        Open, //初始时候的状态
        Pending, //正在走这一步process,前提是前一步的process是Approved
        Canceled //引起workflowrequest和certification均变为cancled
    }
}