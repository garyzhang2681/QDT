using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public enum WorkflowActionTarget
    {
        Request,//qdt_workflow_request
        Process, // qdt_workflow_process
        DirectCertification, //qdt_workflow_certification
        TrainerCertification 
    }
}