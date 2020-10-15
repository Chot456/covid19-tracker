import React from 'react'
import { Card, CardContent, Typography } from "@material-ui/core"
import "./InfoBox.css";

//rfce automatic react template
// install es7 extention

function InfoBox({title, cases, isRed, active, total, ...props }) {
    
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && 'infoBox--selected'} ${active && 'infoBox--red'}`}
            >
            <CardContent>
                {/** Title i.e coronavirus cases */}
                <Typography className="infoBox_title" color="textSecondary">{title}</Typography>
                
                {/** +120 Number of cases  */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h2>

                {/** 1.2M total */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
