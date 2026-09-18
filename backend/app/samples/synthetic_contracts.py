from typing import Dict, Any
from app.models.schemas import (
    DocumentSummary, BeforeYouSignReport, Clause, RiskLabel, ClauseCategory, PrepKit
)
from datetime import datetime

SYNTHETIC_DOCUMENTS: Dict[str, Dict[str, Any]] = {
    "emp_001": {
        "doc_id": "emp_001",
        "title": "Senior Software Engineer Employment Agreement",
        "file_name": "Senior_Engineer_Employment_Agreement.pdf",
        "file_type": "pdf",
        "uploaded_at": datetime.now().isoformat(),
        "page_count": 4,
        "executive_summary": (
            "This is a full-time Employment Agreement between Nexus Tech Solutions Pvt. Ltd. "
            "and Arjun Sharma for the position of Senior Software Engineer in Bengaluru, India. "
            "It sets out salary terms, a 90-day notice period, IP assignment, a 12-month post-employment "
            "non-compete clause, and strict confidentiality obligations."
        ),
        "parties_involved": [
            "Nexus Tech Solutions Pvt. Ltd. (Employer)",
            "Arjun Sharma (Employee)"
        ],
        "key_dates_and_deadlines": [
            "Commencement Date: October 1, 2026",
            "Probation Period: 6 Months from Commencement",
            "Notice Period: 90 Days written notice after probation",
            "Salary Payment: 1st day of each calendar month"
        ],
        "total_financial_value": "₹28,000,000 CTC per annum + 10% annual performance bonus",
        "full_text": """EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is executed on this 25th day of September 2026 at Bengaluru, Karnataka, India by and between:

NEXUS TECH SOLUTIONS PVT. LTD., a company incorporated under the Companies Act, 2013, having its registered office at Koramangala, Bengaluru - 560034 (hereinafter referred to as the "Company" or "Employer");

AND

Mr. Arjun Sharma, residing at Indiranagar, Bengaluru - 560038 (hereinafter referred to as the "Employee").

1. APPOINTMENT AND PROBATION
1.1 The Company hereby appoints the Employee as Senior Software Engineer commencing on 01 October 2026.
1.2 The Employee shall be on probation for a period of six (6) months. During probation, either party may terminate this Agreement by giving fifteen (15) days written notice.

2. COMPENSATION AND BENEFITS
2.1 The Employee shall receive a Base Salary of ₹28,00,000/- (Rupees Twenty-Eight Lakhs only) per annum, payable in monthly installments on the 1st of each month.
2.2 The Employee may be eligible for a discretionary performance bonus of up to 10% based on annual review.

3. NOTICE PERIOD AND TERMINATION
3.1 Post probation, either party may terminate employment by providing ninety (90) days prior written notice or payment of Base Salary in lieu thereof at the sole discretion of the Company.
3.2 The Company reserves the right to terminate employment immediately without notice in cases of gross misconduct, breach of confidentiality, or criminal indictment.

4. INTELLECTUAL PROPERTY RIGHTS
4.1 All inventions, software codes, patents, designs, and proprietary algorithms created or developed by the Employee during the course of employment shall belong exclusively to the Company ("Work for Hire").

5. NON-COMPETE AND NON-SOLICITATION
5.1 For a period of twelve (12) months post termination, the Employee shall not work for, consult, or assist any direct competitor of the Company operating in South Asia.
5.2 The Employee shall not solicit any client, partner, or employee of the Company for 24 months post termination.

6. GOVERNING LAW AND DISPUTE RESOLUTION
6.1 This Agreement shall be governed by and construed in accordance with the laws of India. Courts in Bengaluru, Karnataka shall have exclusive jurisdiction over all disputes.
""",
        "before_you_sign": {
            "document_title": "Senior Software Engineer Employment Agreement",
            "document_type": "Employment Agreement",
            "what_you_are_agreeing_to": [
                "Full-time employment as Senior Software Engineer at Nexus Tech Solutions.",
                "Assigning all IP and code generated during employment to the company.",
                "A 12-month post-employment non-compete restriction across South Asia."
            ],
            "what_you_must_pay": [
                "No upfront payment required.",
                "Salary in lieu of notice if you leave without serving full 90-day notice (subject to company discretion)."
            ],
            "your_key_obligations": [
                "Provide 90 days written notice to resign after probation.",
                "Refrain from working for direct competitors for 12 months post-exit.",
                "Maintain strict confidentiality of company trade secrets and source code."
            ],
            "cancellation_and_exit_rules": [
                "During Probation (first 6 months): 15 days notice by either party.",
                "After Probation: 90 days written notice required.",
                "Immediate termination by employer for gross misconduct or breach of confidentiality."
            ],
            "missing_or_ambiguous_information": [
                "Does not define specific metrics or formula for the 10% annual bonus eligibility.",
                "Does not list explicit examples of prohibited direct competitors under Clause 5.1.",
                "Does not specify severance pay terms in case of company redundancy/layoff."
            ],
            "questions_for_lawyer_or_other_party": [
                "Is the 12-month non-compete clause enforceable under Section 27 of the Indian Contract Act?",
                "Can the notice period during probation be matched after confirmation, or is 90 days negotiable?",
                "Will IP created outside office hours on personal devices without company resources belong to the employee?"
            ],
            "jurisdiction_noted": "Bengaluru, Karnataka, India"
        },
        "clauses": [
            {
                "id": "c1",
                "section_number": "3.1",
                "title": "90-Day Notice Period",
                "category": "Termination & Notice Period",
                "risk_label": "Important to Understand",
                "original_text": "Post probation, either party may terminate employment by providing ninety (90) days prior written notice or payment of Base Salary in lieu thereof at the sole discretion of the Company.",
                "plain_summary": "You must give 3 months notice before leaving the company. The company can choose whether to let you pay salary instead of serving notice.",
                "why_it_matters": "A 90-day notice period is lengthy and may make it difficult to join new employers who require quicker onboarding.",
                "suggested_questions": [
                    "Can buy-out of notice period be requested by the employee?",
                    "What happens to unbilled leave balances during notice period?"
                ],
                "page_number": 2
            },
            {
                "id": "c2",
                "section_number": "5.1",
                "title": "Post-Employment Non-Compete (12 Months)",
                "category": "Non-Compete & Restrictive Covenants",
                "risk_label": "Requires Professional Review",
                "original_text": "For a period of twelve (12) months post termination, the Employee shall not work for, consult, or assist any direct competitor of the Company operating in South Asia.",
                "plain_summary": "You are forbidden from working for any competing technology business in South Asia for 1 full year after leaving.",
                "why_it_matters": "Under Section 27 of the Indian Contract Act 1872, agreements in restraint of trade post-employment are generally void, but employers often use them as legal leverage.",
                "suggested_questions": [
                    "Is this post-employment non-compete legally enforceable in India?",
                    "Does the company pay compensation during this 12-month restriction period?"
                ],
                "page_number": 3
            },
            {
                "id": "c3",
                "section_number": "4.1",
                "title": "Comprehensive IP Assignment",
                "category": "Intellectual Property",
                "risk_label": "Potential Concern",
                "original_text": "All inventions, software codes, patents, designs, and proprietary algorithms created or developed by the Employee during the course of employment shall belong exclusively to the Company ('Work for Hire').",
                "plain_summary": "Any code or invention created while employed belongs entirely to the employer.",
                "why_it_matters": "Ensure side projects or personal open-source code created outside work hours are explicitly excluded.",
                "suggested_questions": [
                    "Does this clause apply to personal side projects built outside work hours?",
                    "Can an exclusion list of prior intellectual property be attached?"
                ],
                "page_number": 3
            }
        ]
    },
    "lease_002": {
        "doc_id": "lease_002",
        "title": "Residential Tenancy Lease Agreement",
        "file_name": "Residential_Lease_Agreement_HSR.pdf",
        "file_type": "pdf",
        "uploaded_at": datetime.now().isoformat(),
        "page_count": 3,
        "executive_summary": (
            "An 11-month Residential Lease Agreement between Mr. Ramesh V. Kumar (Lessor) "
            "and Priya Nair (Lessee) for a 2BHK Apartment in HSR Layout, Bengaluru. "
            "Includes ₹35,000 monthly rent, ₹200,000 security deposit, 5% annual escalation, "
            "and a mandatory 2-month notice for vacating."
        ),
        "parties_involved": [
            "Mr. Ramesh V. Kumar (Landlord/Lessor)",
            "Ms. Priya Nair (Tenant/Lessee)"
        ],
        "key_dates_and_deadlines": [
            "Lease Start Date: October 15, 2026",
            "Lease Period: 11 Months",
            "Monthly Rent Due Date: On or before 5th of each month",
            "Notice Period: 2 Months written notice before vacating"
        ],
        "total_financial_value": "₹35,000 Monthly Rent + ₹200,000 Security Deposit",
        "full_text": """RESIDENTIAL LEASE AGREEMENT

This Lease Agreement is executed on 15th October 2026 at Bengaluru between:
Mr. Ramesh V. Kumar, Landlord, AND Ms. Priya Nair, Tenant.

1. PREMISES & RENT
The Landlord leases Apartment 302, Green Acres, HSR Layout, Bengaluru.
Monthly rent is ₹35,000/-, payable by the 5th of every month.

2. SECURITY DEPOSIT
The Tenant has deposited ₹2,000,000/- as refundable interest-free security deposit.
The deposit shall be refunded upon vacating after deducting painting charges (fixed 1 month rent) and damages.

3. LOCK-IN PERIOD & NOTICE
There is a 6-month lock-in period. Tenant cannot vacate within 6 months.
Post lock-in, either party must give 2 months notice.
""",
        "before_you_sign": {
            "document_title": "Residential Tenancy Lease Agreement",
            "document_type": "Rental / Lease Agreement",
            "what_you_are_agreeing_to": [
                "11-month residential lease for Apartment 302 in HSR Layout.",
                "6-month mandatory lock-in period with no early exit allowed.",
                "Automatic deduction of 1 month rent (₹35,000) for painting upon vacating."
            ],
            "what_you_must_pay": [
                "Monthly Rent: ₹35,000/- due by 5th of every month.",
                "Security Deposit: ₹2,00,000/- interest-free deposit upfront.",
                "Late Fee: ₹500 per day for payments delayed past 5th."
            ],
            "your_key_obligations": [
                "Pay rent promptly on or before 5th of every month.",
                "Maintain premises in good condition without major alterations.",
                "Give 2 months written notice to vacate after the 6-month lock-in period."
            ],
            "cancellation_and_exit_rules": [
                "Lock-in Period: 6 Months (leaving early forfeits security deposit).",
                "Notice Period: 2 Months written notice required after lock-in.",
                "Painting charge deduction: Fixed 1 month rent (₹35,000) automatically subtracted from deposit."
            ],
            "missing_or_ambiguous_information": [
                "Does not clarify who pays major structural building repair costs vs minor maintenance.",
                "Does not specify exact timeframe within which security deposit must be refunded after handing over keys."
            ],
            "questions_for_lawyer_or_other_party": [
                "Is a mandatory 1-month painting deduction valid if the tenant stays for less than 11 months?",
                "Within how many calendar days will the remaining deposit balance be transferred back?"
            ],
            "jurisdiction_noted": "Bengaluru, Karnataka, India"
        },
        "clauses": [
            {
                "id": "lc1",
                "section_number": "2",
                "title": "Fixed Painting Deduction from Deposit",
                "category": "Payment & Compensation",
                "risk_label": "Potential Concern",
                "original_text": "The deposit shall be refunded upon vacating after deducting painting charges (fixed 1 month rent) and damages.",
                "plain_summary": "The landlord will automatically keep ₹35,000 from your security deposit for repainting, regardless of condition.",
                "why_it_matters": "A mandatory 1-month rent deduction for painting can be excessive if you reside for a short duration or leave the walls spotless.",
                "suggested_questions": [
                    "Can painting deduction be prorated based on length of stay?",
                    "Can tenant arrange professional painting independently at lower cost?"
                ],
                "page_number": 1
            },
            {
                "id": "lc2",
                "section_number": "3",
                "title": "6-Month Lock-in Period",
                "category": "Termination & Notice Period",
                "risk_label": "Important to Understand",
                "original_text": "There is a 6-month lock-in period. Tenant cannot vacate within 6 months. Post lock-in, either party must give 2 months notice.",
                "plain_summary": "You cannot move out during the first 6 months without losing your deposit.",
                "why_it_matters": "If your job moves or personal situation changes during the first 6 months, exit costs will be high.",
                "suggested_questions": [
                    "What happens if job relocation forces an exit during lock-in?"
                ],
                "page_number": 2
            }
        ]
    }
}
