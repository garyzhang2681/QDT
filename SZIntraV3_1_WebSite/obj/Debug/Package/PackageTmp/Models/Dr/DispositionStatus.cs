using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Dr
{
    public enum DispositionStatus
    {
        Create,
        Open,
        Running,
        Reject,
        Completed,
        Reviewed,
        Success,
        Failure
    }
}