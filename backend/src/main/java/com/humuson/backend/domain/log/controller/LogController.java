package com.humuson.backend.domain.log.controller;

import com.humuson.backend.global.model.dto.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {

    @GetMapping("/test")
    public Result<String> test() {
        return Result.of("Success");
    }


}
