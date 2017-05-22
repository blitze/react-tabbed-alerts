import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';

import Scrollable from './Scrollable';
import TabList from '../components/TabList';
import TabPanel from '../components/TabPanel';

const tabClasses = {
  'pills': 'nav nav-pills pull-right',
  'scrollable': 'nav nav-tabs',
  'vertical': 'nav nav-pills nav-stacked',
};

class Tabs extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      activeTab: '',
    });
  }

  handleClick = (tab) => (e) => {
    this.activeTab = tab;
    this.props.onTabClick();
  };

  render() {
    const { data, display } = this.props;

    let mainTabs = Object.keys(data);
		/*
    if (display === 'vertical') {
      mainTabs = mainTabs.sort();
    }
		*/

    let tabList = [];
    let tabPanels = [];
    let activeTab = mainTabs.length && !this.activeTab ? mainTabs[0] : this.activeTab;

    for (let i = 0, size = mainTabs.length; i < size; i++) {
      const tab = mainTabs[i];
      const { posts, subTabs } = data[tab];
      const activeClass = activeTab === tab ? 'active' : '';
      const content = (subTabs) ? <Tabs data={subTabs} display="vertical" maxHeight={this.props.maxHeight} onTabClick={this.props.onTabClick} /> : posts;

      tabList.push(
        <TabList
          key={tab}
          title={tab}
          data={data[tab]}
          activeClass={activeClass}
          onClick={this.handleClick(tab)}
        />
      );

      tabPanels.push(
        <TabPanel
          key={tab}
          activeClass={activeClass}
          content={content}
          maxHeight={this.props.maxHeight}
        />
      );
  	}

    tabList = <ul className={tabClasses[display]}>{tabList}</ul>;

  	if (display === 'scrollable') {
  		tabList = <Scrollable>{tabList}</Scrollable>;
  	}

  	let colClass = '';
  	let clearfix = '';
  	if (display === 'vertical') {
  		colClass = 'col-md-10 col-xs-9';
  		tabList = <div className="col-md-2 col-xs-3 tablist">{tabList}</div>;
  	} else if (display === 'pills') {
  		clearfix = <div className="clearfix"></div>;
  	}

    return (
  		<div>
  			{tabList}
  			{clearfix}
  			<div className={`${colClass} tab-content`}>
  				{tabPanels}
  			</div>
  		</div>
  	);
  }
}

export default observer(Tabs);
