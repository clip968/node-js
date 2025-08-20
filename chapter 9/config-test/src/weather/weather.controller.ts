import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('weather')
export class WeatherController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    public getWeather(): string {
        const apiUrl = this.configService.get('WEATHER_API_URL');
        const apiKey = this.configService.get('WEATHER_API_KEY');
        
        return this.callWeatherApi(apiUrl, apiKey);
    }

    private callWeatherApi(apiUrl: string, apiKey: string): string {
        console.log("날씨 정보 가져오는 중...");
        console.log(apiUrl);
        console.log(apiKey);
        return "날씨 정보";
    }
}
