import nodemailer from 'nodemailer'

const sendEmaill = ({email,subject,text,html}) => {
        let mailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
          }
      });
       
      let mailDetails = {
          from: process.env.EMAIL,
          to: `${email}`,
          subject: subject,//'Orgo Earth - Community Invitation',
          text: text, //`A new Evidence has been added`,
          html:html //`<p>A new Evidence has been added</p>`
      };
       
      mailTransporter.sendMail(mailDetails, function(err, data) {
          if(err) {
              console.log(err);
          } else {
              console.log('Email sent successfully');
          }
      })
    
 
}

export default sendEmaill