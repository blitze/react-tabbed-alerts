const jsf = require('json-schema-faker');

const maxItems = 50;
const minItems = 40;

jsf.option({
	failOnInvalidTypes: false,
	defaultInvalidTypeProduct: true,
});

jsf.extend('faker', function(faker) {
	let seqId = 1000;
	const statusAr = ['', '', '', '[Resolved] ', 'Resolved - '];

	faker.custom = {
		category: function() {
			let categories = [];
			let max = faker.random.number({
				max: 3,
			});
			for (let i = 0; i < max; i++) {
				categories.push(faker.commerce.department());
			}

			return [...new Set(categories)];
		},
		seqId: function(minId) {
			const incr = faker.random.number({
				min: 1,
				max: 3,
			});
			seqId += incr;
			return seqId;
		},
		subject: function() {
			return faker.random.arrayElement(statusAr) + faker.hacker.phrase();
		},
	};
	return faker;
});

jsf.extend('chance', function(chance) {
	chance.mixin({
		tags: function() {
			const num = chance.integer({
				min: 0,
				max: 5,
			});
			return chance.pickset(
				[
					'alpha',
					'bravo',
					'charlie',
					'alert',
					'echo',
					'pu',
					'known_issue',
				],
				num,
			);
		},
	});

	return chance;
});

const schema = {
	type: 'object',
	properties: {
		alerts: {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: {
						id: {
							type: 'integer',
							faker: 'custom.seqId',
						},
						published: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						tags: {
							type: 'array',
							chance: 'tags',
						},
						updated: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						startDate: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						endDate: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						contentID: {
							$ref: '#/definitions/contentID',
						},
						replyCount: {
							type: 'integer',
							minimum: 0,
							maximum: 5,
						},
						subject: {
							type: 'string',
							faker: 'custom.subject',
						},
						categories: {
							type: 'array',
							faker: 'custom.category',
						},
						type: {
							type: 'string',
							chance: {
								pickone: [
									[
										'document',
										'discussion',
										'event',
										'file',
										'ideas',
									],
								],
							},
						},
					},
					maxItems: maxItems,
					minItems: minItems,
					required: [
						'id',
						'published',
						'tags',
						'updated',
						'startDate',
						'endDate',
						'contentID',
						'replyCount',
						'subject',
						'categories',
						'type',
					],
				},
			},
			required: ['list'],
		},
		featured: {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: {
						id: {
							type: 'integer',
							faker: 'custom.seqId',
						},
						published: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						startDate: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						endDate: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						updated: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						subject: {
							type: 'string',
							faker: {
								fake: '{{lorem.sentence}} (featured)',
							},
						},
						categories: {
							type: 'array',
							faker: 'custom.category',
						},
						tags: {
							type: 'array',
							chance: 'tags',
						},
						type: {
							type: 'string',
							chance: {
								pickone: [
									[
										'document',
										'discussion',
										'event',
										'file',
										'ideas',
									],
								],
							},
						},
					},
					maxItems: maxItems,
					minItems: minItems,
					required: [
						'id',
						'published',
						'startDate',
						'endDate',
						'updated',
						'subject',
						'categories',
						'tags',
						'type',
					],
				},
			},
			required: ['list'],
		},
		discussions: {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: {
						id: {
							type: 'integer',
							faker: 'custom.seqId',
						},
						published: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						startDate: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						endDate: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						updated: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						subject: {
							type: 'string',
							faker: {
								fake: '{{lorem.sentence}} (discussion)',
							},
						},
						categories: {
							type: 'array',
							faker: 'custom.category',
						},
						tags: {
							type: 'array',
							chance: 'tags',
						},
						type: {
							type: 'string',
							chance: {
								pickone: [
									[
										'document',
										'discussion',
										'event',
										'file',
										'ideas',
									],
								],
							},
						},
					},
					maxItems: maxItems,
					minItems: minItems,
					required: [
						'id',
						'published',
						'startDate',
						'endDate',
						'updated',
						'subject',
						'categories',
						'tags',
						'type',
					],
				},
			},
			required: ['list'],
		},
		events: {
			type: 'object',
			properties: {
				list: {
					type: 'array',
					items: {
						id: {
							type: 'integer',
							faker: 'custom.seqId',
						},
						published: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						tags: {
							type: 'array',
							chance: 'tags',
						},
						updated: {
							type: 'string',
							faker: 'date.recent',
							format: 'date-time',
						},
						startDate: {
							type: 'string',
							faker: 'date.future',
							format: 'date-time',
						},
						endDate: {
							type: 'string',
							faker: 'date.future',
							format: 'date-time',
						},
						contentID: {
							$ref: '#/definitions/contentID',
						},
						replyCount: {
							type: 'integer',
							minimum: 0,
							maximum: 5,
						},
						subject: {
							type: 'string',
							faker: {
								fake: '{{lorem.sentence}} (event)',
							},
						},
						categories: {
							type: 'array',
							faker: 'custom.category',
						},
						type: {
							type: 'string',
							chance: {
								pickone: [['event']],
							},
						},
					},
					maxItems: maxItems,
					minItems: minItems,
					required: [
						'id',
						'published',
						'tags',
						'updated',
						'startDate',
						'endDate',
						'contentID',
						'replyCount',
						'subject',
						'categories',
						'type',
					],
				},
			},
			required: ['list'],
		},
	},
	required: ['alerts', 'featured', 'discussions', 'events'],
	definitions: {
		contentID: {
			type: 'integer',
			minimum: 0,
			minimumExclusive: true,
		},
	},
};

module.exports = function() {
	return jsf(schema);
};
