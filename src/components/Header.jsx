// src/components/Header.js
import * as React from 'react';
import { AppBar, AppBarSection, AppBarSpacer, Avatar } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { menuIcon } from '@progress/kendo-svg-icons';

const Header = () => {
    const kendokaAvatar = 'https://demos.telerik.com/kendo-react-ui/assets/suite/kendoka-react.png';

    return (
        <React.Fragment>
        <AppBar themeColor='primary'>
            <AppBarSection>
                <Button type="button" fillMode="flat" svgIcon={menuIcon} />
            </AppBarSection>

            <AppBarSpacer style={{ width: 4 }} />
            
            <AppBarSection className="title">
                    <h1 className="title">Bookworm Insights</h1>
            </AppBarSection>

            <AppBarSpacer style={{ width: 32 }} />

            <AppBarSpacer />

            <AppBarSection>
                <Avatar shape="circle" type="image">
                    <img src={kendokaAvatar} alt="Kendoka Avatar" />
                </Avatar>
            </AppBarSection>
        </AppBar>

<style>{`
    body {
        background: #dfdfdf;
    }
    .title {
        font-size: 18px;
        margin: 0;
    }
    ul {
        font-size: 14px;
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
    }
    li {
        margin: 0 10px;
    }
    li:hover {
        cursor: pointer;
        color: #84cef1;
    }
    .k-badge-container {
        margin-right: 8px;
    }
  `}</style>
  </React.Fragment>
    );
};

export default Header;