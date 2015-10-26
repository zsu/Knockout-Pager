ko.components.register('pager', {
    viewModel: function (params) {
        var self = this;
        self.PageSize = params.PageSize;
        self.PageNumber = params.PageNumber;
        self.Callback = params.Callback;
        self.totalPages = ko.computed(function () {
            var div = Math.floor(params.TotalRecords() / params.PageSize());
            div += params.TotalRecords() % params.PageSize() > 0 ? 1 : 0;
            return div;
        });

        self.nextPage = function (data) {
            if (data <= self.totalPages() && data > 0) {
                self.PageNumber(data);
                self.Callback(false);
            }
        };
        self.pagesFirstGroup = ko.observableArray([]);
        self.pagesSecondGroup = ko.observableArray([]);
        self.pagesFirstGroupComputed = ko.computed(function () {
            var underlyingArray = self.pagesFirstGroup();
            if (self.totalPages() > 10) {
                if (params.PageNumber() <= 5) {
                    self.pagesFirstGroup([1, 2, 3, 4, 5]);
                }
                else if (params.PageNumber() >= self.totalPages() - 9) {
                    self.pagesFirstGroup.removeAll();
                    for (var i = self.totalPages() - 9; i < self.totalPages() - 4; i++) {
                        underlyingArray.push(i);
                    }
                    self.pagesFirstGroup.valueHasMutated();
                }
                else {
                    self.pagesFirstGroup.removeAll();
                    for (var i = params.PageNumber() - 1; i < params.PageNumber() + 4; i++) {
                        underlyingArray.push(i);
                    }
                    self.pagesFirstGroup.valueHasMutated();
                }
            }
            else {
                self.pagesFirstGroup.removeAll();
                for (var i = 1; i <= self.totalPages() ; i++) {
                    underlyingArray.push(i);
                }
                self.pagesFirstGroup.valueHasMutated();
            }
        });
        self.pagesSecondGroupComputed = ko.computed(function () {
            if (self.totalPages() > 10) {
                self.pagesSecondGroup.removeAll();
                var underlyingArray = self.pagesSecondGroup();
                for (var i = self.totalPages() - 4; i <= self.totalPages() ; i++) {
                    underlyingArray.push(i);
                }
                self.pagesSecondGroup.valueHasMutated();
            }
            else {
                self.pagesSecondGroup([]);
            }
        });
        self.hasMorePages = ko.computed(function () {
            if (self.totalPages() > 10 && params.PageNumber() < (self.totalPages() - 9)) {
                return true;
            }
            return false;
        });
        self.setPageSize = function (size) {
            self.PageSize(size);
            //self.search(true, params.data);
            self.Callback(true);
        };
    },
    template:
        '	                    <!-- ko if: totalPages() > 0 -->\
	                    <div class="row">\
	                        <div class="pagination-holder result-selector-holder bottom">\
	                            <ul class="pagination result-selector left">\
	                                <li class="label">Show</li>\
                                    <li data-bind="css:{current:PageSize()==10}"><a href="javascript:void(0)" data-bind="click:function(){ setPageSize(10) }">10</a></li>\
                                    <li data-bind="css:{current:PageSize()==25}"><a href="javascript:void(0)" data-bind="click:function(){ setPageSize(25) }">25</a></li>\
                                    <li data-bind="css:{current:PageSize()==50}"><a href="javascript:void(0)" data-bind="click:function(){ setPageSize(50) }">50</a></li>\
	                                <li class="value">Results</li>\
	                            </ul>\
	                            <!-- ko if: totalPages() > 1 -->\
	                            <ul class="pagination right">\
	                                <!-- ko if: (PageNumber() > 10) -->\
	                                <li class="arrow"><a href="javascript:void(0);" data-bind="click: function(){ nextPage(PageNumber() - 10) }">&laquo;</a></li>\
	                                <!-- /ko -->\
                                    <!-- ko if: (PageNumber() != 1) -->\
                                    <li class="arrow"><a href="javascript:void(0);" data-bind="click: function(){ nextPage(PageNumber() - 1) }"><i class="fa fa-caret-left "></i><span class="text">Prev</span></a></li>\
                                    <!-- /ko -->\
	                                <!-- ko foreach: pagesFirstGroup() -->\
	                                <li data-bind="css: { current: $data == $parent.PageNumber() }">\
	                                    <a href="javascript:void(0);" data-bind="text: $data, click: function(data) { $parent.nextPage(data) }"></a>\
	                                </li>\
	                                <!-- /ko -->\
	                                <!-- ko if: hasMorePages() -->\
	                                <li><a href="javascript:void(0);" data-bind="click: function() { nextPage(PageNumber() + 5) }">&hellip;</a></li>\
	                                <!-- /ko -->\
	                                <!-- ko foreach: pagesSecondGroup() -->\
	                                <li data-bind="css: { current: $data == $parent.PageNumber() }">\
	                                    <a href="javascript:void(0);" data-bind="text: $data, click: function(data) { $parent.nextPage(data) }"></a>\
	                                </li>\
	                                <!-- /ko -->\
	                                <li class="arrow" data-bind="css:{unavailable:totalPages() == PageNumber()}"><a href="javascript:void(0);" data-bind="click: function(){ nextPage(PageNumber() + 1) }"><span class="text">Next</span><i class="fa fa-caret-right "></i></a></li>\
	                            </ul>\
	                            <!-- /ko -->\
	                        </div>\
	                    </div>\
	                    <!-- /ko -->'
});