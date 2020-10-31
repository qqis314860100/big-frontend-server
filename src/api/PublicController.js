import svgCaptcha from 'svg-captcha';

class PublicController {
  async getCaptcha(ctx) {
    const body = ctx.query;
    const newCaptcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0oO1ilLI',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38,
    });
    ctx.body = {
      code: 200,
      data: newCaptcha.data,
    };
  }
}

export default new PublicController();
