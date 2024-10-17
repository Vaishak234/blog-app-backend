const nodemailer = require('nodemailer')



module.exports =  async (email,subject,url)=> {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            post: process.env.EMAIL_PORT,
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass:process.env.PASSWORD
            }
        })

        const htmlOptions = `
        <div>
           <a href=${url}>${url}</a>
        </div>
        `

        await transport.sendMail(({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: 'text',
            html: '<p> Click <a href="'+url+'"> here to verify </a> </p>'

        }))

        console.log('email send succesfully');
        
    } catch (error) {
        console.log(error);
    }
}