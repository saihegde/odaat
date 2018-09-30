package com.anchormind.odaat.cucumber.stepdefs;

import com.anchormind.odaat.OdaatApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = OdaatApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
