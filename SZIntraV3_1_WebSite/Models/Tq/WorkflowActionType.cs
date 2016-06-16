using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public enum WorkflowActionType
    {
       
        /// <summary>
        /// make workflow goes to next step, or close
        /// </summary>
        Approve,

        /// <summary>
        /// make workflow back to previous step
        /// </summary>
        Reject,

        /// <summary>
        /// cancel a workflow make all furthur(include current) steps' status as 'canceled', and mark workflow request's status as 'canceled'
        /// </summary>
        Cancel,

        /// <summary>
        /// create a request
        /// </summary>
        Create,
    }
}