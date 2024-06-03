import axios from 'axios';
class PhoneSender {
  static async sendSMS(phone, code) {
  const params = {
    login: "aiganym_bazarbay",
    psw: "12345678Aa",
    phones: `+7${phone}`,
    mes: `Innit '${code}'`
  };

  const url = `https://smsc.kz/sys/send.php?login=${params.login}&psw=${params.psw}&phones=${params.phones}&mes=${params.mes}&charset=utf-8`;
  console.log("Url: ", url)

  try {
    const response = await axios.get(url);
    console.log('Response:', response.data);
    console.log("SMS sent successfully", phone, code);
  } catch (error) {
    console.error('Error:', error);
  }
  }
}

export default PhoneSender;
