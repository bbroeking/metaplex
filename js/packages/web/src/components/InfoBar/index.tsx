import { Button, Row } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const InfoBar = () => {
    return (
        <Row style={{ display: 'flex', justifyContent: 'space-around'}}>
            <Link to={`/`}>
                <Button>
                    CHYMERV
                </Button>
            </Link>
            <Link to={`/`}>
                <Button>
                    How it works
                </Button>
            </Link>
            <Link to={`/`}>
                <Button>
                    Docs
                </Button>
            </Link>
            <Link to={`/`}>
                <Button>
                    Terms of use
                </Button>
            </Link>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                <Link to={`/`}>
                    <img style={{ height: 30}} src="/svg/discord.svg" alt="discord" />
                </Link>
                <Link to={`/`}>
                    <img style={{ height: 30}}  src="/svg/twitter.svg" alt="twitter" />
                </Link>
            </div>
        </Row>
    )
}

export default InfoBar
