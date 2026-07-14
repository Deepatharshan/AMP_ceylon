import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface InquiryDetails {
  customer_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  country?: string;
  message?: string;
}

interface InquiryItemDetails {
  product_name: string;
  product_code: string;
  quantity: number;
  notes?: string;
}

export async function sendInquiryNotification(inquiryDetails: InquiryDetails, items: InquiryItemDetails[]) {
  const notifyEmail = process.env.NOTIFY_EMAIL

  if (!notifyEmail) {
    console.error('NOTIFY_EMAIL is not set')
    return
  }

  const itemsHtml = items.map(item => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.product_name}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.product_code}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.notes || '-'}</td>
    </tr>
  `).join('')

  const html = `
    <h2>New Inquiry from ${inquiryDetails.customer_name}</h2>
    <p><strong>Company:</strong> ${inquiryDetails.company_name || '-'}</p>
    <p><strong>Email:</strong> ${inquiryDetails.email}</p>
    <p><strong>Phone:</strong> ${inquiryDetails.phone || '-'}</p>
    <p><strong>Country:</strong> ${inquiryDetails.country || '-'}</p>
    <p><strong>Message:</strong> ${inquiryDetails.message || '-'}</p>
    <br/>
    <h3>Requested Products</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product Name</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product Code</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Notes</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
  `

  try {
    const { data, error } = await resend.emails.send({
      from: 'AMP Ceylon Inquiries <onboarding@resend.dev>',
      to: [notifyEmail],
      subject: `New Inquiry from ${inquiryDetails.customer_name}`,
      html: html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
