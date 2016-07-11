define([
    '$',
    'global/utils',

    'dust!global/partials/size-chart/default-tab-content'
], function($, Utils) {
    // markup
    var $rowMarkup = $('<tr class="js-new-rows"></tr>');
    var $cellMarkup = $('<td class="js-new-cell c-table-cell"></td>');
    var $imgTables = [];

    var _sanitizeTable = function($table) {
        $table.find('td').each(function() {
            var $cell = $(this);
            if ($cell.text().trim() === '') {
                $cell.remove();
            }
        });
    };

    var _constructNewTable = function($destinationTable, $oldRow) {
        $oldRow.find('th, td').each(function() {
            var $contents = $(this);

            var $newCell = $cellMarkup.clone().append($contents.contents());
            var $newRow = $rowMarkup.clone().append($newCell);

            var emptyRows = parseInt($contents.attr('colspan'));

            $destinationTable.append($newRow);

            // make empty rows for old cells that has colspan > 1
            if (emptyRows && emptyRows >= 2) {
                for (var j = 0; j < emptyRows - 1; j++) {
                    var $placeHolderRows = $rowMarkup.clone();
                    var $placeHolderCell = $cellMarkup.clone();

                    $destinationTable.append($placeHolderRows.append($placeHolderCell));
                }
            }
        });
    };

    var _addColumns = function($destinationTable, $oldRow) {
        $oldRow.find('th, td').each(function(idx) {
            var $cell = $(this);

            // ignore "empty" cells
            if ($cell.text().trim() === '' || /^(\&nbsp\;)$/.test($cell.text())) {
                return;
            }

            $cell.find('br').remove();

            var $newCell = $cellMarkup.clone().append($cell.contents());
            $destinationTable.find('tr').eq(idx).append($newCell);
        });
    };

    var _addColumnsFromRows = function(rows, $destinationTable) {
        if (!$destinationTable.length) {
            return;
        }

        var columns = rows.length;

        for (var i = 0; i < columns; i++) {
            var $oldRow = rows[i];

            // if this is our first column, construct new table rows first
            if (!$destinationTable.find('tr').length) {
                _constructNewTable($destinationTable, $oldRow);
            } else {
                // append columns
                _addColumns($destinationTable, $oldRow);
            }
        }
    };

    var _buildStaticTable = function($originalTable, columns) {
        if (!$originalTable.length) {
            return;
        }

        var $table = $('<table class="js-static-table c-table c-arrange__item c--shrink c--static"></table>');
        var rows = [];

        $originalTable.find('tr').each(function(idx) {
            if (idx > (columns - 1)) {
                return false;
            }

            rows.push($(this).remove());
        });

        _addColumnsFromRows(rows, $table);

        return $table;
    };

    var _buildScrollingTable = function($originalTable) {
        if (!$originalTable.length) {
            return;
        }

        var $table = $('<table class="js-scrolling-table c-table"></table>');
        var rows = [];

        $originalTable.find('tr').each(function() {
            rows.push($(this));
        });

        _addColumnsFromRows(rows, $table);

        return $table;
    };

    var _parseTable = function($table) {
        if (!$table.length) {
            return;
        }

        var $staticTable;
        var $scrollingTable = $('<table class="js-scrolling-table"></table>');
        var staticColumnSize = 0;

        _sanitizeTable($table);

        $table.find('tr').each(function(idx) {
            var $row = $(this);

            if (idx === 0) {
                staticColumnSize++;
            }

            // desktop has 2 sizings: XS-S-M-L and 2-4-6-8, so we need 2 columns in static table
            // td > strong is desktop markup for another row full of <th>
            if ($row.find('td > strong').length === $row.find('td').length && $row.find('td > strong').length > 1) {
                staticColumnSize++;
            }
        });

        $staticTable = _buildStaticTable($table, staticColumnSize);
        $scrollingTable = _buildScrollingTable($table);

        return {
            staticTable: $staticTable,
            scrollerTableContent: {genericContent: true, scrollerContent: $scrollingTable}
        };
    };

    var _parseSizeChart = function($content) {
        // sanitize tables
        $content.find('.measurements').each(function() {
            var $table = $(this);
            $table.find('img').filter(function() {
                return /spacer01\.gif/.test($(this).attr('src'));
            }).remove();
        });

        return $content.find('.measurements').map(function(i, table) {
            var $table = $(table);

            // tables with images should not be tabs
            // output inline in pinny
            if ($table.find('td > img').length) {
                $imgTables.push($table.remove());
                return;
            }

            // Prepend empty cell to hat size chart
            if (window.location.href.includes('exofficio')) {
                // MENS exofficio Replace heading with shorter one
                var $heading = $table.find('.heading').find('strong');
                // MENS exofficio Prepend empty header
                $table.find('tr:not(.heading)').eq(0).prepend($('<th>&nbsp;</th>'));
                if ($heading.length) {
                    $heading.text($heading.text().replace('MEN\'S SIZE FIT GUIDE', 'FIT GUIDE'));
                    $heading.text($heading.text().replace('MEN\'S PANTS & UNDERWEAR SIZE FIT GUIDE', 'PANTS & UNDERWEAR'));
                    $heading.text($heading.text().replace('HAT SIZE FIT GUIDE', 'HAT'));
                    $heading.text($heading.text().replace('SOCK SIZE FIT GUIDE', 'SOCK'));
                }

                // Capitalize heading for the men's sock section
                if ($heading.text().includes('SOCK')) {
                    $table.find('tr > td:nth-child(1)').filter(':eq(1), :eq(2)').map(function(_, item) {
                        var $item = $(item);
                        $item.text($item.text().toLowerCase().replace(/(^|\s)[a-z]/g, function(f) {return f.toUpperCase();}));
                    });
                }

                var $notes = $table.find('th:contains("Note")');
                var notes = [];

                $notes.map(function(_, note) {
                    notes.push($('<p>' + $(note).remove().text() + '</p>'));
                });


                // MENS exofficio Replace table header with shorter one
                $table.find('tr:has(th)').find('th:nth-child(1)').map(function(_, item) {
                    var $item = $(item);
                    $item.html($item.html().replace('<br>', '').replace('FROM', '').replace('CENTER BACK', ''));
                });
            }

            // Capitalize header text
            $table.find('tr td:nth-child(1)').filter(':eq(1)').map(function(_, item) {
                var $item = $(item).find('strong');
                $item.text($item.text().toLowerCase().replace(/(^|\s)[a-z]/g, function(f) {return f.toUpperCase();}));
            });

            $table.find('tr th:nth-child(1)').filter(':eq(1), :eq(2), :eq(3)').map(function(_, item) {
                var $item = $(item);
                $item.text($item.text().toLowerCase().replace(/(^|\s)[a-z]/g, function(f) {return f.toUpperCase();}));
            });

            var $tableTitle = $table.find('.heading').remove();
            var $tableTitleUpdatedModifier = $tableTitle.find('span').addClass('u-text-small u-text-gray u-margin-start-sm').remove();
            var tableData;
            var $rows;

            $rows = $table.find('tr');

            tableData = _parseTable($table);

            return {
                tableTitle: $tableTitle.text().toLowerCase(),
                tableTitleModifier: $tableTitleUpdatedModifier,
                staticTable: tableData.staticTable,
                notes: notes,
                scrollerTableContent: tableData.scrollerTableContent,
                value: i + 1
            };
        });

    };

    var _getTabContent = function($content, url) {
        var $howToContainer = $content.find('table.howto');
        var $howTo = $howToContainer.find('strong:first').remove();
        var $additionalTableInfo = $content.find('.measurements .howto p').removeAttr('style');

        // Remove fit-guide image
        $content.find('img[src*="fitguide-head"]').remove();
        // Remove the rows containing the additional table info
        $additionalTableInfo.closest('tr').remove();

        // Image
        $content.find('img[src*="sizing_charts"]').last().attr('align', '');

        // Wrap phone number in anchor
        Utils.wrapPhoneNumInAnchor($howToContainer.find('td'));

        // Parse static content
        var $staticContent = $howToContainer.find('td').find('p');

        return {
            isDefault: true,
            sizeChart: _parseSizeChart($content),
            additionalTableInfo: $additionalTableInfo,
            howToText: $howTo.text().toLowerCase(),
            howToMoreInfo: $howToContainer.find('td').html(),
            imgTables: $imgTables,
            sizeChartImage: $content.find('img[src*="sizing_charts"]').last().removeAttr('align')
        };
    };

    var _getWomenSizeChartTitle = function(index) {
        var titles = [
            'Petite Size',
            'Plus Size'
        ];
        return titles[index];
    };

    var _parse = function($content) {
        var isMultiple = ($content.find('.heading').length > 1);
        var tabContent = _getTabContent($content);
        var tabs = tabContent.sizeChart.map(function(index, chart) {
            var content = jQuery.extend({}, tabContent);
            var title = chart.tableTitle.trim();

            content.sizeChart = chart;
            return {
                title: /women/ig.test(title) ? _getWomenSizeChartTitle(index) : title,
                contentTemplate: 'global/partials/size-chart/default-tab-content',
                content: content
            };
        });
        return {
            multiple: isMultiple,
            tabs: tabs
        };
    };


    return {
        parse: _parse
    };
});
