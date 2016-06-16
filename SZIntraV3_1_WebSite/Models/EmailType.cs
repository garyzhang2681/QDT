using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models
{
    public enum EmailType
    {
        //When DR is reportd, send DR header information to QE and ME
        //@Model is QdtDiscrepancyReport
        QdtNewDiscrepancyReport,

        //When Disposition is created, send disposition header information to QE
        //@Model is QdtDisposition
        QdtDispositionCreated,

        //Send QE owner the detail about each created action
        //@Model is QdtAction
        QdtActionCreated,

        //When disposition is approved
        //Send action owner the action detail need to do for each action
        //@Model is QdtDisposition
        QdtActionReleased,

        //Send to QE owner information about the action change committed by ME owner
        //@Model is QdtAction
        QdtActionUpdated,

        //When the last action is completed for one disposition, send ME and QE the dispostion details, including actions' summary
        //@Model is QdtDisposition
        QdtActionAllCompleted,

        //When disposition is accpected or rejected, send ME owner a disposition summary
        //@Model is QdtDisposition
        QdtDispositionReviewed,

        //When DR is closed by QE owner, send ME owner about this DR
        //@Model is QdtDiscrepancyReport
        QdtDiscrepancyReportClosed,

        //When disposition is reject by QE owner, ME owner about this disposition
        //@Model is QdtDisposition
        QdtDispositionRejected,


        //When LL training is created
        //@Model is VmQdtWorkflowRequest
        QdtLlCertificationCreated,


        //When LL certification is granted to trainee
        //@Model is VmQdtWorkflowRequest
        QdtLlCertificationGranted,

        //Show Process Information
        //@Model is VmQdtWorkflowRequest Vm:View model
        QdtLlCertificationInProcess,

        //Create a Tq skill
        //@Model is VmQdtStcWorkflowRequest
        QdtStcSkillCreated,

        //Cancel a STC trainging request
        //@Model is VmQdtStcWorkflowRequest
        QdtStcSkillCanceled,


        //When STC certification is granted to trainee
        //@Model is VmQdtStcWorkflowRequest
        QdtStcCertificationGranted,

        //Show Process Information
        //@Model is VmQdtStcWorkflowRequest Vm:View model
        QdtStcCertificationInProcess,

        //Show Direct Certification Information
        //@Model is QdtTqDirectCertificationCreated
        QdtTqDirectCertificationCreated
    }




}