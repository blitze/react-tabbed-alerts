import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';

import Scrollable from './Scrollable';
import TabList from '../components/TabList';
import TabPanel from '../components/TabPanel';

const tabClasses = {
	pills: 'nav nav-pills sub-nav justify-content-end',
	scrollable: 'nav nav-tabs',
	vertical: 'nav flex-column nav-pills',
};

const displayMap = {
	scrollable: 'vertical',
	vertical: 'pills',
	pills: 'scrollable',
};

class Tabs extends Component {
	constructor(props) {
		super(props);

		extendObservable(this, {
			activeTab: '',
		});
	}

	handleClick = tab => () => {
		this.activeTab = tab;
		this.props.onTabClick();
	};

	render() {
		const { baseName, data, display } = this.props;

		let mainTabs = Object.keys(data);

		// if (display === 'vertical') {
		// 	mainTabs = mainTabs.sort();
		// }

		let tabList = [];
		let tabPanels = [];
		let activeTab =
			mainTabs.length && !this.activeTab ? mainTabs[0] : this.activeTab;

		for (let i = 0, size = mainTabs.length; i < size; i++) {
			const tab = mainTabs[i];
			let { posts, subTabs } = data[tab];
			const activeClass = activeTab === tab ? 'active' : '';
			const tabName = [baseName, tab.toLowerCase().replace(' ', '-')]
				.filter(Boolean)
				.join('-');
			const id = 'nav-' + tabName;
			const numSubTabs = Object.keys(subTabs).length;

			let content;
			if (numSubTabs) {
				if (posts.length) {
					subTabs = {
						All: { posts, subTabs: {} },
						...subTabs,
					};
				}

				content = (
					<Tabs
						baseName={tabName}
						data={subTabs}
						display={displayMap[display]}
						maxHeight={this.props.maxHeight}
						onTabClick={this.props.onTabClick}
					/>
				);
			} else {
				content = posts.slice();
			}

			tabList.push(
				<TabList
					key={tab}
					id={id}
					title={tab}
					data={data[tab]}
					activeClass={activeClass}
					onClick={this.handleClick(tab)}
				/>,
			);

			tabPanels.push(
				<TabPanel
					key={tab}
					id={id}
					activeClass={activeClass}
					content={content}
					maxHeight={this.props.maxHeight}
				/>,
			);
		}

		let colClass = '';
		if (tabList.length > 1) {
			tabList = (
				<ul className={tabClasses[display]} role="tablist">
					{tabList}
				</ul>
			);

			if (display === 'scrollable') {
				tabList = <Scrollable>{tabList}</Scrollable>;
			}

			if (display === 'vertical') {
				colClass = 'col-md-10 col-xs-9 ';
				tabList = (
					<div className="col-md-2 col-xs-3 tablist">{tabList}</div>
				);
			}
		} else {
			tabList = null;
		}

		return (
			<div className={display === 'vertical' ? 'row' : ''}>
				{tabList}
				<div className={`${colClass}tab-content w-100`}>
					{tabPanels}
				</div>
			</div>
		);
	}
}

export default observer(Tabs);
